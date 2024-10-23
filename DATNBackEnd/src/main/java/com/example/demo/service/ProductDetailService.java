package com.example.demo.service;

import com.example.demo.dto.ProductDetailDTO;
import com.example.demo.entity.ProductDetail;
import com.example.demo.response.ProductDetailResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ProductDetailService {
    List<ProductDetailResponse> getAll();

    ProductDetail addProductDetail(ProductDetailDTO productDetailDTO) throws Exception;

    ProductDetail pdate(Integer id, ProductDetailDTO pdd) throws  Exception;

    ProductDetail getPDById(Integer id) throws Exception;

    void deletePD(Integer id) throws Exception;

    Page<ProductDetailResponse> pageAndFilterWithProductDetailResponse(String productName, String code, String colorName, String sizeName, Double minPrice,Double maxPrice, Pageable pageable);
  
    ProductDetail uploadImageForProductDetail(Integer productId, Integer productDetailId, MultipartFile file) throws Exception;
}
