package com.example.demo.controller;


import com.example.demo.dto.ProductDetailDTO;
import com.example.demo.entity.ProductDetail;
import com.example.demo.response.ProductDetailResponse;
import com.example.demo.service.ProductDetailService;
import com.example.demo.response.MessageReponse;
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
    private ProductDetailService productDetailService;

    @GetMapping("")
    public ResponseEntity<?> getAllProductDetails() {
        List<ProductDetailResponse> productDetailResponses = productDetailService.getAll();
        return new ResponseEntity<>(productDetailResponses, HttpStatus.OK);
    }

    @GetMapping("/getAllProductDetail")
    public ResponseEntity<MessageReponse> getAll(){
        List<ProductDetailResponse> productDetailList = productDetailService.getAll();
        return ResponseEntity.ok().body(MessageReponse.builder()
                .message("get info successfuly")
                .status(HttpStatus.OK.value())
                .data(productDetailList)
                .build()
        );
    }


    @PostMapping("")
    public ResponseEntity<?> addProductDetail(@Valid @RequestBody ProductDetailDTO productDetailDTO, BindingResult result) {
        if (result.hasErrors()) {
            return new ResponseEntity<>(result.getFieldErrors(), HttpStatus.BAD_REQUEST);
        }
        try {
            ProductDetail savedProductDetail = productDetailService.addProductDetail(productDetailDTO);
            return new ResponseEntity<>(savedProductDetail, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }


    @PutMapping("{id}")
    public ResponseEntity<?> updateProductDetail(@PathVariable("id") Integer id,
                                                 @Valid @RequestBody ProductDetailDTO productDetailDTO,
                                                 BindingResult result) {
        if (result.hasErrors()) {
            return new ResponseEntity<>(result.getFieldErrors(), HttpStatus.BAD_REQUEST);
        }
        try {
            ProductDetail updatedProductDetail = productDetailService.update(id, productDetailDTO);
            return new ResponseEntity<>(updatedProductDetail, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("detail/{id}")
    public ResponseEntity<ProductDetail> getProductDetailById(@PathVariable("id") Integer id) {
        try {
            ProductDetail productDetail = productDetailService.getPDById(id);
            return new ResponseEntity<>(productDetail, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProductDetail(@PathVariable("id") Integer id) {
        try {
            productDetailService.deletePD(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
