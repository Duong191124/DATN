package com.example.demo.controller;

import com.example.demo.dto.ProductDTO;
import com.example.demo.entity.Product;
import com.example.demo.entity.ProductDetail;
import com.example.demo.response.MessageReponse;
import com.example.demo.response.PageProductResponse;
import com.example.demo.response.ProductDetailResponse;
import com.example.demo.response.ProductResponse;
import com.example.demo.service.ProductService;
import com.example.demo.service.impl.ProductDetailServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("${api.prefix}/products")
@RequiredArgsConstructor
public class ProductController {

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024;

    private final ProductService productService;
    private final ProductDetailServiceImpl productDetailService;

    @GetMapping("/getAllProduct")
    public ResponseEntity<MessageReponse> getAllProduct() {
        List<ProductResponse> productResponseList = productService.getAll();
        if (productResponseList.isEmpty()) {
            return ResponseEntity.ok(new MessageReponse("failed", 0, null));
        } else {
            return ResponseEntity.ok(new MessageReponse("success", 1, productResponseList));
        }
    }


    @GetMapping("")
    public ResponseEntity<PageProductResponse> pageAllProduct(
            @RequestParam(defaultValue = "", value = "category_id") Integer categoryId,
            @RequestParam(defaultValue = "", value = "name") String productName,
            @RequestParam(defaultValue = "", value = "sleeve_id") Integer sleeveId,
            @RequestParam(defaultValue = "", value = "collar_id") Integer collarId,
            @RequestParam(defaultValue = "", value = "brand_id") Integer brandId,
            @RequestParam(defaultValue = "") Double price,
            @RequestParam(defaultValue = "") String description,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "3") int pageSize) {

        // Đảm bảo page không nhỏ hơn 1
        page = Math.max(1, page);
        Pageable pageable = PageRequest.of(page - 1, pageSize, Sort.by("id").ascending());

        Page<ProductResponse> productResponsePage = productService.pageAllProducts(
                categoryId, productName, sleeveId, collarId, brandId, price, description, pageable);

        int pageCurrent = productResponsePage.getNumber() + 1; // Cộng thêm 1 để trả về trang bắt đầu từ 1
        int pageSizeCurrent = productResponsePage.getSize();
        long totalElement = productResponsePage.getTotalElements();
        List<ProductResponse> productResponseList = productResponsePage.getContent();

        return ResponseEntity.ok(PageProductResponse.builder()
                .productResponseList(productResponseList)
                .page(pageCurrent)
                .pageSize(pageSizeCurrent)
                .totalElement(totalElement)
                .build());
    }

    @PostMapping("")
    public ResponseEntity<?> addProduct(@Valid @RequestBody ProductDTO productDTO, BindingResult result) {
        if (result.hasErrors()) {
            List<String> errorMessage = result.getFieldErrors().stream().map(FieldError::getDefaultMessage).toList();
            return ResponseEntity.badRequest().body(errorMessage);
        }
        try {
            ProductResponse createProductResponse = productService.createdProduct(productDTO);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new MessageReponse("add successfully", 1, createProductResponse));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PostMapping(value = "upload/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadImage(@PathVariable() int id, @ModelAttribute("file") MultipartFile file) {
        try {
            if (file.getSize() > MAX_FILE_SIZE) {
                return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE).body("File is too large! Maximum size is 5MB");
            }
            Product newProduct = productService.uploadImageProduct(id, file);
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new MessageReponse("Upload image product successfully", HttpStatus.OK.value(), newProduct));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PostMapping(value = "uploadForProductDetail/{productId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadImageForProductDetail(@PathVariable() int productId,
                                                         @RequestParam("color") String colorName,
                                                         @ModelAttribute("file") MultipartFile file) {
        try {
            if (file.getSize() > MAX_FILE_SIZE) {
                return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE).body("File is too large! Maximum size is 5MB");
            }
            ProductDetail newProductDetail = productDetailService.uploadImageWithColor(productId, colorName, file);
            ProductDetailResponse productDetailResponse = ProductDetailResponse.fromProductDetailResponse(newProductDetail);
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new MessageReponse("Upload image productDetail successfully", HttpStatus.OK.value(), productDetailResponse));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable Integer id, @Valid @RequestBody ProductDTO productDTO, BindingResult result) {
        if (result.hasErrors()) {
            List<String> errorMessage = result.getFieldErrors().stream().map(FieldError::getDefaultMessage).toList();
            return ResponseEntity.badRequest().body(errorMessage);
        }
        try {
            ProductResponse productResponse = productService.updatedProduct(id, productDTO);
            return ResponseEntity.ok(new MessageReponse("Updated successfully", 1, productResponse));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable int id) {
        try {
            productService.deletedProduct(id);
            return ResponseEntity.ok("Deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
    @GetMapping("productId/{id}")
    public ResponseEntity<?> getById(@PathVariable Integer id){
        try {
            ProductResponse product = productService.findById(id);
            return ResponseEntity.ok()
                    .body(MessageReponse.builder()
                            .message("Lay thong tin thanh cong")
                            .status(HttpStatus.OK.value())
                            .data(product)
                            .build());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }
    @GetMapping("/{productId}")
    public ResponseEntity<?> getProductById(@PathVariable Integer productId) {
        try {
            ProductResponse product = productService.findById(productId);
            List<ProductDetailResponse> productDetails = productService.getProductDetailsByProductId(productId)
                    .stream()
                    .map(ProductDetailResponse::fromProductDetailResponse)
                    .toList();

            Map<String, Object> response = new HashMap<>();
            response.put("product", product);
            response.put("details", productDetails);

            return ResponseEntity.ok(new MessageReponse("Lay thong tin thanh cong", HttpStatus.OK.value(), response));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found");
        }
    }
}
