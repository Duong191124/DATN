package com.example.demo.service.impl;

import com.example.demo.dto.ProductDetailDTO;
import com.example.demo.entity.*;
import com.example.demo.repository.*;
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

    @Autowired
    private WeightRepo weightRepo;

    @Override
    public List<ProductDetailResponse> getAll() {
        return productDetailRepo.findAll().stream().map(ProductDetailResponse::fromProductDetailResponse).collect(Collectors.toList());
    }

    @Override
    public ProductDetail addProductDetail(ProductDetailDTO productDetailDTO) throws Exception {
        ProductDetail newProductDetail = new ProductDetail();
        newProductDetail.setCode(productDetailDTO.getCode());
        newProductDetail.setQuantity(productDetailDTO.getQuantity());
        newProductDetail.setDefaultPrice(productDetailDTO.getDefaultPrice());
//        newProductDetail.setDiscountPrice(productDetailDTO.getDiscountPrice());
        newProductDetail.setImage(productDetailDTO.getImage());

        // Liên kết với các entity khác
        newProductDetail.setProduct(getProductById(productDetailDTO.getProductId()));
        newProductDetail.setSize(getSizeById(productDetailDTO.getSizeId()));
        newProductDetail.setColor(getColorById(productDetailDTO.getColorId()));
        newProductDetail.setWeight(getWeightById(productDetailDTO.getWeightId()));

        return productDetailRepo.save(newProductDetail);
    }

    public ProductDetail update(Integer id, ProductDetailDTO productDetailDTO) throws Exception {
        // Tìm kiếm productDetail dựa trên ID
        ProductDetail existingProductDetail = productDetailRepo.findById(id)
                .orElseThrow(() -> new Exception("ProductDetail not found"));

        // Cập nhật thông tin từ DTO sang entity
        existingProductDetail.setCode(productDetailDTO.getCode());
        existingProductDetail.setQuantity(productDetailDTO.getQuantity());
        existingProductDetail.setDefaultPrice(productDetailDTO.getDefaultPrice());
//        existingProductDetail.setDiscountPrice(productDetailDTO.getDiscountPrice());
        existingProductDetail.setImage(productDetailDTO.getImage());
        existingProductDetail.setStatus(productDetailDTO.getStatus());
        existingProductDetail.setProduct(getProductById(productDetailDTO.getProductId()));
        existingProductDetail.setSize(getSizeById(productDetailDTO.getSizeId()));
        existingProductDetail.setColor(getColorById(productDetailDTO.getColorId()));
        existingProductDetail.setWeight((getWeightById(productDetailDTO.getWeightId())));
        // Lưu lại productDetail đã cập nhật
        return productDetailRepo.save(existingProductDetail);
    }

    @Override
    public ProductDetailResponse getPDById(Integer id) throws Exception {
        ProductDetail productDetail = productDetailRepo.findById(id)
                .orElseThrow(() -> new Exception("ProductDetail not found with id: " + id));
        return ProductDetailResponse.fromProductDetailResponse(productDetail);
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
    public Page<ProductDetailResponse> pageAndFilterWithProductDetailResponse(String productName, String code, String colorName, String weightName, String sizeName, Double minPrice, Double maxPrice, Integer status, Pageable pageable) {
        Page<ProductDetail> productDetailPage = productDetailRepo.pageAndFilterProductDetail(productName, code, colorName, sizeName, weightName, minPrice, maxPrice, status, pageable);
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

    public Weight getWeightById(Integer id) throws Exception {
        return weightRepo.findById(id)
                .orElseThrow(() -> new Exception("weight not found with id: " + id));
    }
}
