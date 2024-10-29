package com.example.demo.service;

import com.example.demo.dto.ProductDTO;
import com.example.demo.entity.Product;
import com.example.demo.entity.ProductDetail;
import com.example.demo.response.ProductResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ProductService {
    List<ProductResponse> getAll();

    ProductResponse createdProduct(ProductDTO productDTO);

    ProductResponse updatedProduct(int id, ProductDTO productDTO);

    Product uploadImageProduct(Integer id, MultipartFile file) throws Exception;

    List<ProductDetail> getProductDetailsByProductId(Integer productId);

    void deletedProduct(Integer id);

    ProductResponse findById(Integer id);

    Page<ProductResponse> pageAllProducts(Integer categoryId, String productName, Integer sleeveId, Integer collarId, Integer brandId, Double price, String description,Integer status, Pageable pageable);

    boolean canDeleteProduct(Integer productId);
}
