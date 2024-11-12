package com.example.demo.service.impl;

import com.example.demo.dto.ProductDetailDTO;
import com.example.demo.entity.Color;
import com.example.demo.entity.Product;
import com.example.demo.entity.ProductDetail;
import com.example.demo.entity.Size;
import com.example.demo.repository.ColorRepo;
import com.example.demo.repository.ProductDetailRepo;
import com.example.demo.repository.ProductRepo;
import com.example.demo.repository.SizeRepo;
import com.example.demo.response.ProductDetailResponse;
import com.example.demo.service.ProductDetailService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class ProductDetailServiceImpl implements ProductDetailService {
    private final ProductDetailRepo productDetailRepo;

    @Autowired
    private CloudinaryServiceImpl cloudinaryService;

    @Autowired
    private ProductRepo productRepo;

    @Autowired
    private SizeRepo sizeRepo;

    @Autowired
    private ColorRepo colorRepo;
    @Override
    public List<ProductDetailResponse> getAll(){
        return productDetailRepo.findAll().stream().map(ProductDetailResponse::fromProductDetailResponse).collect(Collectors.toList());
    }

    @Override
    public ProductDetail addProductDetail(ProductDetailDTO productDetailDTO) throws Exception {
        ProductDetail newProductDetail = new ProductDetail();
        newProductDetail.setCode(productDetailDTO.getCode());
        newProductDetail.setQuantity(productDetailDTO.getQuantity());
        newProductDetail.setPrice(productDetailDTO.getPrice());
        newProductDetail.setImage(productDetailDTO.getImage());

        // Liên kết với các entity khác
        newProductDetail.setProduct(getProductById(productDetailDTO.getProductId()));
        newProductDetail.setSize(getSizeById(productDetailDTO.getSizeId()));
        newProductDetail.setColor(getColorById(productDetailDTO.getColorId()));

        return productDetailRepo.save(newProductDetail);
    }
    public ProductDetail update(Integer id, ProductDetailDTO productDetailDTO) throws Exception {
        // Tìm kiếm productDetail dựa trên ID
        ProductDetail existingProductDetail = productDetailRepo.findById(id)
                .orElseThrow(() -> new Exception("ProductDetail not found"));

        // Cập nhật thông tin từ DTO sang entity
        existingProductDetail.setCode(productDetailDTO.getCode());
        existingProductDetail.setQuantity(productDetailDTO.getQuantity());
        existingProductDetail.setPrice(productDetailDTO.getPrice());
        existingProductDetail.setImage(productDetailDTO.getImage());
        existingProductDetail.setStatus(productDetailDTO.getStatus());
        existingProductDetail.setProduct(getProductById(productDetailDTO.getProductId()));
        existingProductDetail.setSize(getSizeById(productDetailDTO.getSizeId()));
        existingProductDetail.setColor(getColorById(productDetailDTO.getColorId()));

        // Lưu lại productDetail đã cập nhật
        return productDetailRepo.save(existingProductDetail);
    }

    @Override
    public ProductDetailResponse getPDById(Integer id) throws Exception {
        ProductDetail productDetail =productDetailRepo.findById(id)
                .orElseThrow(() -> new Exception("ProductDetail not found with id: " + id));
        return ProductDetailResponse.fromProductDetailResponse(productDetail);
    }

    @Override
    public ProductDetailResponse getPDByCode(String code) {
        return ProductDetailResponse.fromProductDetailResponse(productDetailRepo.findProductDetailByCode(code));
    }

    @Override
    public void deletePD(Integer id) throws Exception {
        ProductDetail productDetail = productDetailRepo.findById(id)
                .orElseThrow(() -> new Exception("ProductDetail not found with id: " + id));
        productDetailRepo.delete(productDetail);
    }



    @Override
    public ProductDetail uploadImageForProductDetail(Integer ProductId, Integer productDetailId, MultipartFile file) throws Exception {
        String imageUrl = cloudinaryService.uploadImage(file);

        ProductDetail productDetail = productDetailRepo.findByIdAndProductId(productDetailId, ProductId)
                .orElseThrow(() -> new Exception("Product detail not found"));

        productDetail.setImage(imageUrl);
        return productDetailRepo.save(productDetail);
    }

    @Override
    public Page<ProductDetailResponse> pageAndFilterWithProductDetailResponse(String productName, String code, String colorName, String sizeName, Double minPrice, Double maxPrice, Integer status, Pageable pageable) {
        Page<ProductDetail> productDetailPage = productDetailRepo.pageAndFilterProductDetail(productName,code,colorName,sizeName,minPrice,maxPrice,status,pageable);
        return productDetailPage.map(ProductDetailResponse::fromProductDetailResponse);
    }

    public Product getProductById(Integer id) throws Exception {
        return productRepo.findById(id)
                .orElseThrow(() -> new Exception("Product not found with id: " + id));
    }

    public Size getSizeById(Integer id) throws Exception {
        return sizeRepo.findById(id)
                .orElseThrow(() -> new Exception("Size not found with id: " + id));
    }

    public Color getColorById(Integer id) throws Exception {
        return colorRepo.findById(id)
                .orElseThrow(() -> new Exception("Color not found with id: " + id));
    }
}
