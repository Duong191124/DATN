package com.example.demo.controller;

import com.example.demo.dto.ProductDetailDTO;
import com.example.demo.entity.ProductDetail;
import com.example.demo.service.impl.ProductDetailServiceImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.prefix}/productDetail")
public class ProductDetailController {
    @Autowired
    private ProductDetailServiceImpl productDetailService;

    @GetMapping("")
    public ResponseEntity<List<ProductDetail>> getAllProductDetails() {
        List<ProductDetail> productDetails = productDetailService.getAll();
        return new ResponseEntity<>(productDetails, HttpStatus.OK);
    }

    // Thêm một ProductDetail mới
    @PostMapping("")
    public ResponseEntity<?> addProductDetail(@Valid @RequestBody ProductDetailDTO productDetailDTO, BindingResult result) {
        if (result.hasErrors()) {
            // Trả về thông báo lỗi nếu có lỗi xác thực
            return new ResponseEntity<>(result.getFieldErrors(), HttpStatus.BAD_REQUEST);
        }
        try {
            ProductDetail savedProductDetail = productDetailService.addProductDetail(productDetailDTO);
            return new ResponseEntity<>(savedProductDetail, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }


    // Cập nhật một ProductDetail
    @PutMapping("{id}")
    public ResponseEntity<?> updateProductDetail(@PathVariable("id") Integer id,
                                                 @Valid @RequestBody ProductDetailDTO productDetailDTO,
                                                 BindingResult result) {
        if (result.hasErrors()) {
            // Trả về thông báo lỗi nếu có lỗi xác thực
            return new ResponseEntity<>(result.getFieldErrors(), HttpStatus.BAD_REQUEST);
        }
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
    @DeleteMapping("{id}")
    public ResponseEntity<Void> deleteProductDetail(@PathVariable("id") Integer id) {
        try {
            productDetailService.deletePD(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
