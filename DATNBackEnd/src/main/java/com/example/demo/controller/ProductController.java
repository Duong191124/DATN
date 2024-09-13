package com.example.demo.controller;

import com.example.demo.dto.ProductDTO;
import com.example.demo.entity.Product;
import com.example.demo.entity.ProductDetail;
import com.example.demo.response.MessageReponse;
import com.example.demo.response.ProductDetailResponse;
import com.example.demo.service.ProductService;
import com.example.demo.service.impl.CloudinaryServiceImpl;
import com.example.demo.service.impl.ProductDetailServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
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

    @GetMapping("")
    public ResponseEntity<MessageReponse> getAllProduct(){
        List<ProductDTO> productDTOList = productService.getAll();
        if(productDTOList.isEmpty()){
            return ResponseEntity.ok(new MessageReponse("failed",0,null));
        }
        else{
            return ResponseEntity.ok(new MessageReponse("success",1,productDTOList));
        }
    }
    
    @PostMapping("")
    public ResponseEntity<MessageReponse> addProduct(@Valid @ModelAttribute ProductDTO productDTO){
        ProductDTO createProductDTO = productService.createdProduct(productDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(new MessageReponse("add successfully",1,createProductDTO));
    }
    
    @PostMapping(value = "upload/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadImage(@PathVariable() int id, @ModelAttribute("file") MultipartFile file){
        try {
            if(file.getSize() > MAX_FILE_SIZE){
                return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE).body("file is so large! Maximum size is 5MB");
            }
            Product newProduct = productService.uploadImageProduct(id, file);
            return ResponseEntity.status(HttpStatus.OK)
                    .body(MessageReponse.builder()
                            .message("Upload image product successfully")
                            .status(HttpStatus.OK.value())
                            .data(newProduct)
                            .build());
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
    
    @PostMapping(value = "uploadForProductDetail/{productId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadImageForProductDetail(@PathVariable() int productId, @RequestParam("color") String colorName, @ModelAttribute("file") MultipartFile file){
        try {
            if(file.getSize() > MAX_FILE_SIZE){
                return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE).body("file is so large! Maximum size is 5MB");
            }
            ProductDetail newProductDetail = productDetailService.uploadImageWithColor(productId, colorName, file);
            ProductDetailResponse productDetailResponse = ProductDetailResponse.fromProductDetailResponse(newProductDetail);
            return ResponseEntity.status(HttpStatus.OK)
                    .body(MessageReponse.builder()
                            .message("Upload image productDetail successfully")
                            .status(HttpStatus.OK.value())
                            .data(productDetailResponse)
                            .build());
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    
    @PutMapping("/{id}")
    public ResponseEntity<MessageReponse> updateProduct(@PathVariable int id,@Valid @ModelAttribute ProductDTO productDTO){
        ProductDTO productDTOUpdate = productService.updatedProduct(id,productDTO);
        return ResponseEntity.ok(new MessageReponse("updated successfully",1,productDTOUpdate));
    }
  
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable int id){
        productService.deletedProduct(id);
        return ResponseEntity.ok("deleted successfully");
    }

    @GetMapping("{productId}")
    public ResponseEntity<?> getProductById(@PathVariable Integer productId){
        try {
            ProductDTO product = productService.findById(productId);
            List<ProductDetailResponse> productDetails = productService.getProductDetailsByProductId(productId)
                    .stream()
                    .map(ProductDetailResponse::fromProductDetailResponse)
                    .toList();

            Map<String, Object> response = new HashMap<>();
            response.put("product", product);
            response.put("details", productDetails);

            return ResponseEntity.ok()
                    .body(MessageReponse.builder()
                            .message("Lay thong tin thanh cong")
                            .status(HttpStatus.OK.value())
                            .data(response)
                            .build());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);

}
