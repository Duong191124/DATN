package com.example.demo.service;



import com.example.demo.dto.ProductDTO;

import java.util.List;

public interface ProductService {
    List<ProductDTO> getAll();
    ProductDTO createdProduct(ProductDTO productDTO);
    ProductDTO updatedProduct(int id,ProductDTO productDTO);
    void deletedProduct(Integer id);
    ProductDTO findById(Integer id);
}
