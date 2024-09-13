package com.example.demo.service;

import com.example.demo.dto.ProductDTO;
import com.example.demo.entity.Product;
import com.example.demo.entity.ProductDetail;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ProductService {
    List<ProductDTO> getAll();
    ProductDTO createdProduct(ProductDTO productDTO);
    ProductDTO updatedProduct(int id,ProductDTO productDTO);
    Product uploadImageProduct(Integer id, MultipartFile file) throws Exception;
    List<ProductDetail> getProductDetailsByProductId(Integer productId);
    void deletedProduct(Integer id);
    ProductDTO findById(Integer id);
}
