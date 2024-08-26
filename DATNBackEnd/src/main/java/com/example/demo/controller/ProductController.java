package com.example.demo.controller;

import com.example.demo.dto.ProductDTO;
import com.example.demo.response.ApiResponse;
import com.example.demo.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;
    @GetMapping("/list")
    public ResponseEntity<ApiResponse<List<ProductDTO>>> getAllProduct(){
        List<ProductDTO> productDTOList = productService.getAll();
        if(productDTOList.isEmpty()){
            return ResponseEntity.ok(new ApiResponse<>(false,"failed",null));
        }
        else{
            return ResponseEntity.ok(new ApiResponse<>(true,"success",productDTOList));
        }
    }
    @PostMapping("/add")
    public ResponseEntity<ApiResponse<ProductDTO>> addProduct(@Valid @RequestBody ProductDTO productDTO){
        ProductDTO createProductDTO = productService.createdProduct(productDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse<>(true,"add successfully",createProductDTO));
    }
    @PutMapping("/update/{id}")
    public ResponseEntity<ApiResponse<ProductDTO>> updateProduct(@PathVariable int id,@Valid @RequestBody ProductDTO productDTO){
        ProductDTO productDTOUpdate = productService.updatedProduct(id,productDTO);
        return ResponseEntity.ok(new ApiResponse<>(true,"updated successfully",productDTOUpdate));
    }
    @DeleteMapping("/delete")
    public ResponseEntity deleteProduct(@RequestParam int id){
        productService.deletedProduct(id);
        return ResponseEntity.ok("deleted successfully");
    }

}
