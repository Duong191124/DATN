package com.example.demo.controller;

import com.example.demo.dto.ProductDetailDTO;
import com.example.demo.entity.ProductDetail;
import com.example.demo.repository.ProductDetailRepo;
import com.example.demo.service.ProductDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("product-detail")
public class ProductDetailController {
    @Autowired
    private ProductDetailService productDetailService;

    @GetMapping("hien-thi")
    public ResponseEntity<List<ProductDetail>> getAllProductDetails() {
        List<ProductDetail> productDetails = productDetailService.getAll();
        return new ResponseEntity<>(productDetails, HttpStatus.OK);
    }

    // Thêm một ProductDetail mới
    @PostMapping("add")
    public ResponseEntity<ProductDetail> addProductDetail(@RequestBody ProductDetailDTO productDetailDTO) {
        try {
            ProductDetail newProductDetail = new ProductDetail();
            newProductDetail.setCode(productDetailDTO.getCode());
            newProductDetail.setQuantity(productDetailDTO.getQuantity());
            newProductDetail.setPrice(productDetailDTO.getPrice());
            newProductDetail.setImage(productDetailDTO.getImage());

            // Liên kết với các entity khác
            newProductDetail.setProduct(productDetailService.getProductById(productDetailDTO.getProductId()));
            newProductDetail.setSize(productDetailService.getSizeById(productDetailDTO.getSizeId()));
            newProductDetail.setColor(productDetailService.getColorById(productDetailDTO.getColorId()));

            ProductDetail savedProductDetail = productDetailService.add(newProductDetail);
            return new ResponseEntity<>(savedProductDetail, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    // Cập nhật một ProductDetail
    @PutMapping("update/{id}")
    public ResponseEntity<ProductDetail> updateProductDetail(@PathVariable("id") Integer id,
                                                             @RequestBody ProductDetailDTO productDetailDTO) {
        try {
            ProductDetail updatedProductDetail = productDetailService.pdate(id, productDetailDTO);
            return new ResponseEntity<>(updatedProductDetail, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Lấy một ProductDetail theo ID
    @GetMapping("detail/{id}")
    public ResponseEntity<ProductDetail> getProductDetailById(@PathVariable("id") Integer id) {
        try {
            ProductDetail productDetail = productDetailService.getPDById(id);
            return new ResponseEntity<>(productDetail, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Xóa một ProductDetail theo ID
    @DeleteMapping("delete/{id}")
    public ResponseEntity<Void> deleteProductDetail(@PathVariable("id") Integer id) {
        try {
            productDetailService.deletePD(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
