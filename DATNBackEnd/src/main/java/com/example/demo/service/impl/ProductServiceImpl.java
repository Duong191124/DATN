package com.example.demo.service.impl;

import com.example.demo.dto.ProductDTO;
import com.example.demo.entity.Brand;
import com.example.demo.entity.Category;
import com.example.demo.entity.Product;
import com.example.demo.repository.BrandRepo;
import com.example.demo.repository.CategoryRepo;
import com.example.demo.repository.ProductRepo;
import com.example.demo.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProductServiceImpl implements ProductService {
    @Autowired
    ProductRepo productRepo;
    @Autowired
    CategoryRepo categoryRepo;
    @Autowired
    BrandRepo brandRepo;
    @Override
    public List<ProductDTO> getAll() {
        return productRepo.findAll().stream().map(ProductDTO::convertDTO).collect(Collectors.toList());
    }

    @Override
    public ProductDTO createdProduct(ProductDTO productDTO) {
      try {
          Product product = productRepo.save(ProductDTO.convertProduct(productDTO,categoryRepo,brandRepo));
          return ProductDTO.convertDTO(product);
      }catch (Exception e){
          throw new RuntimeException("Failed to add product"+e.getMessage());
      }
    }

    @Override
    public ProductDTO updatedProduct(int id,ProductDTO productDTO) {
        Product product = productRepo.findById(id).orElseThrow(()->new RuntimeException("product not found"));
        product.setCode(productDTO.getCode());
        product.setName(productDTO.getName());
        product.setImage(productDTO.getImage());
        product.setPrice(productDTO.getPrice());
        product.setCollar(productDTO.getCollar());
        product.setSleeve(productDTO.getSleeve());
        product.setDescription(productDTO.getDescription());
        Optional<Brand> brand = brandRepo.findByName(productDTO.getBrandName());
        if(!brand.isPresent()){
            throw new RuntimeException("not found brand");
        }
        product.setBrand(brand.get());
        Optional<Category> category = categoryRepo.findByName(productDTO.getCategoryName());
        if(!category.isPresent()){
            throw new RuntimeException("not found category");
        }
        product.setCategory(category.get());
        Product pr = productRepo.save(product);
        return ProductDTO.convertDTO(pr);
    }

    @Override
    public void deletedProduct(Integer id) {
        ProductDTO productDTO = productRepo.findById(id).map(ProductDTO::convertDTO).get();
        if (productDTO==null){
            throw new RuntimeException("not found product with id:"+id);
        }
            productRepo.delete(ProductDTO.convertProduct(productDTO,categoryRepo,brandRepo));
    }

    @Override
    public ProductDTO findById(Integer id) {
        return productRepo.findById(id).map(ProductDTO::convertDTO).get();
    }
}
