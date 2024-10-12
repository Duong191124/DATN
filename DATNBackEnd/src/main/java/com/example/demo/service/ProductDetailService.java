package com.example.demo.service;

import com.example.demo.dto.ProductDetailDTO;
import com.example.demo.entity.ProductDetail;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ProductDetailService {
    List<ProductDetail> getAll();

    ProductDetail addProductDetail(ProductDetailDTO productDetailDTO) throws Exception;

    ProductDetail pdate(Integer id, ProductDetailDTO pdd) throws  Exception;

    ProductDetail getPDById(Integer id) throws Exception;

    void deletePD(Integer id) throws Exception;

    ProductDetail uploadImageWithColor(Integer productId, String colorName, MultipartFile file) throws Exception;
}
