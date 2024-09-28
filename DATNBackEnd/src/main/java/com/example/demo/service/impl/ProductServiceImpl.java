package com.example.demo.service.impl;

import com.example.demo.dto.ProductDTO;
import com.example.demo.entity.*;

import com.example.demo.repository.*;

import com.example.demo.response.ProductResponse;
import com.example.demo.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;


import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {
    private final BrandRepo brandRepo;
    private final CloudinaryServiceImpl cloudinaryService;
    private final ProductDetailRepo productDetailRepo;
    private final ProductRepo productRepo;
    private final CategoryRepo categoryRepo;
    private final CollarRepo collarRepo;
    private final SleeveRepo sleeveRepo;
    @Override
    public List<ProductResponse> getAll() {
        return productRepo.findAll().stream().map(product -> ProductResponse.convertResponse(product)).toList();
    }

    @Override
    public ProductResponse createdProduct(ProductDTO productDTO) {
      try {
          Product product = productRepo.save(ProductDTO.convertProduct(productDTO,categoryRepo,brandRepo,collarRepo,sleeveRepo));
          return ProductResponse.convertResponse(product);
      }catch (Exception e){
          throw new RuntimeException("Failed to add product"+e.getMessage());
      }
    }

    @Override
    public ProductResponse updatedProduct(int id,ProductDTO productDTO) {
        Product product = productRepo.findById(id).orElseThrow(()->new RuntimeException("product not found"));
        Collar collar = collarRepo.findByName(productDTO.getCollarName()).orElseThrow(()->new RuntimeException("not found collar's name:"+productDTO.getCollarName()));
        Sleeve sleeve = sleeveRepo.findByName(productDTO.getCollarName()).orElseThrow(()->new RuntimeException("not found sleeve's name:"+productDTO.getSleeveName()));
        product.setCode(productDTO.getCode());
        product.setName(productDTO.getName());
        product.setImage(productDTO.getImage());
        product.setPrice(productDTO.getPrice());
        product.setCollar(collar);
        product.setSleeve(sleeve);
        product.setDescription(productDTO.getDescription());
        Optional<Brand> brand = brandRepo.findByName(productDTO.getBrandName());
        if(brand.isEmpty()){
            throw new RuntimeException("not found brand");
        }
        product.setBrand(brand.get());
        Optional<Category> category = categoryRepo.findByName(productDTO.getCategoryName());
        if(category.isEmpty()){
            throw new RuntimeException("not found category");
        }
        product.setCategory(category.get());
        Product pr = productRepo.save(product);
        return ProductResponse.convertResponse(pr);
    }

    @Override
    public Product uploadImageProduct(Integer id, MultipartFile file) throws Exception {
        Optional<Product> existingProductOptional = productRepo.findById(id);
        if (existingProductOptional.isEmpty()) {
            throw new IllegalArgumentException("Product not found");
        }

        Product existingProduct = existingProductOptional.get();
        String imageUrl = cloudinaryService.uploadImage(file);

        existingProduct.setImage(imageUrl);
        return productRepo.save(existingProduct);
    }

    @Override
    public void deletedProduct(Integer id) {
        for (ProductResponse productResponse: productRepo.findAll().stream().map(ProductResponse::convertResponse).toList()
             ) {
            if(productResponse.getId().equals(id)){
                productRepo.deleteById(id);
            }
        }
    }

    @Override
    public ProductResponse findById(Integer id) {
        return productRepo.findById(id).map(ProductResponse::convertResponse).get();
    }

    @Override
    public Page<ProductResponse> pageAllProducts(Integer categoryId, String productName, Integer sleeveId, Integer collarId, Integer brandId, Double price, String description, Pageable pageable) {
        Page<Product> productPage = productRepo.pageAllProducts(categoryId, productName, sleeveId, collarId, brandId, price, description, pageable);
        return productPage.map(ProductResponse::convertResponse);
    }


    @Override
    public List<ProductDetail> getProductDetailsByProductId(Integer productId) {
        return productDetailRepo.findByProductId(productId);
    }
}
