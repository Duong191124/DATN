package com.example.demo.controller;


import com.example.demo.dto.ProductDetailDTO;
import com.example.demo.entity.ProductDetail;
import com.example.demo.response.ProductDetailResponse;
import com.example.demo.service.ProductDetailService;
import com.example.demo.response.MessageReponse;
import com.example.demo.service.impl.ProductDetailServiceImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.parameters.P;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("${api.prefix}/productDetail")
public class ProductDetailController {
    @Autowired
    private ProductDetailService productDetailService;

    @Autowired
    private ProductDetailServiceImpl productDetailServiceImpl;

    @GetMapping("")
    public ResponseEntity<?> getAllProductDetails(@RequestParam(required = false) String productName,
                                                  @RequestParam(required = false) String code,
                                                  @RequestParam(required = false) String colorName,
                                                  @RequestParam(required = false) String sizeName,
                                                  @RequestParam(required = false) String weightName,
                                                  @RequestParam(required = false) Double minPrice,
                                                  @RequestParam(required = false) Double maxPrice,
                                                  @RequestParam(required = false) Integer status,
                                                  @RequestParam(defaultValue = "0") int page,
                                                  @RequestParam(defaultValue = "10") int limit
                                                  ) {
        Pageable pageable = PageRequest.of(page,limit, Sort.by("createdAt").ascending());
        Page<ProductDetailResponse> productDetailResponses = productDetailService.pageAndFilterWithProductDetailResponse(productName,code,colorName,sizeName,minPrice,maxPrice,status,pageable);
        return ResponseEntity.ok(new MessageReponse("successfully",200,productDetailResponses));
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

    @PreAuthorize("hasAuthority('CREATE_PRODUCT_DETAIL')")
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

    @PreAuthorize("hasAuthority('UPDATE_PRODUCT_DETAIL')")
    @PutMapping("/{id}")
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
    public ResponseEntity<?> getProductDetailById(@PathVariable("id") Integer id) {
        try {
            ProductDetailResponse productDetail = productDetailService.getPDById(id);
            return ResponseEntity.ok(new MessageReponse("find product detail successfully with id:"+id,200,productDetail));
        } catch (Exception e) {
            return  ResponseEntity.badRequest().body(HttpStatus.NOT_FOUND);
        }
    } @GetMapping("detailCode/{code}")
    public ResponseEntity<?> getProductDetailById(@PathVariable("code") String code) {
        try {
            ProductDetailResponse productDetail = productDetailService.getPDByCode(code);
            return ResponseEntity.ok(new MessageReponse("find product detail successfully with code:"+code,200,productDetail));
        } catch (Exception e) {
            return  ResponseEntity.badRequest().body(HttpStatus.NOT_FOUND);
        }
    }
    @PreAuthorize("hasAuthority('DELETE_PRODUCT_DETAIL')")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProductDetail(@PathVariable("id") Integer id) {
        try {
            productDetailService.deletePD(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    @GetMapping("/top-featured-productdetail")
    public ResponseEntity<?> getTopFeaturedProducts(@RequestParam(defaultValue = "0") int page,
                                                    @RequestParam(defaultValue = "10") int limit) {
        Pageable pageable = PageRequest.of(page, limit,
                Sort.by(Sort.Order.desc("createdAt"))
                        .and(Sort.by(Sort.Order.desc("quantity")))  // Không sử dụng quantity ở đây
                        .and(Sort.by(Sort.Order.asc("discountPrice"))));

        List<ProductDetailResponse> featuredProducts = productDetailService.getTopFeaturedProducts(pageable);
        return ResponseEntity.ok(new MessageReponse("Successfully retrieved top featured products", 200, featuredProducts));
    }

    @PostMapping("check-duplicate")
    public ResponseEntity<Map<String, Boolean>> checkDuplicateCode(@RequestBody Map<String, String> request) {

        String type = request.get("type");
        String value = request.get("value");

        boolean exists = productDetailServiceImpl.isDuplicate(type, value);
        Map<String, Boolean> response = new HashMap<>();
        response.put("exists", exists);
        return ResponseEntity.ok(response);
    }



}
