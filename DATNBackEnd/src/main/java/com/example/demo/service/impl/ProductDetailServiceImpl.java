package com.example.demo.service.impl;

import com.example.demo.dto.ProductDetailDTO;
import com.example.demo.entity.ProductDetail;

import java.util.List;

public interface ProductDetailServiceImpl {
    List<ProductDetail> getAll();

    ProductDetail addProductDetail(ProductDetailDTO productDetailDTO) throws Exception;

    ProductDetail pdate(Integer id, ProductDetailDTO pdd) throws  Exception;

    ProductDetail getPDById(Integer id) throws Exception;

    void deletePD(Integer id) throws Exception;
}
