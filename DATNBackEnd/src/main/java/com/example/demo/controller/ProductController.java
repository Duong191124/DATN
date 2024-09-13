package com.example.demo.controller;

import com.example.demo.dto.PaymentDTO;
import com.example.demo.dto.ProductDTO;
import com.example.demo.entity.Product;
import com.example.demo.response.MessageReponse;
import com.example.demo.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;
    @GetMapping("/list")
    public ResponseEntity<MessageReponse> getAllProduct(){
        List                <ProductDTO> productDTOList = productService.getAll();
        if(productDTOList.isEmpty()){
            return ResponseEntity.ok(new MessageReponse("failed",0,null));
        }
        else{
            return ResponseEntity.ok(new MessageReponse("success",1,productDTOList));
        }
    }
    @PostMapping("/add")
    public ResponseEntity<?> addProduct(@Valid @ModelAttribute ProductDTO productDTO, BindingResult result){
            try {
                if(result.hasErrors()){
                List<String> message =result.getFieldErrors().stream().map(FieldError::getDefaultMessage).toList();
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(message);
                }
                ProductDTO createProductDTO = productService.createdProduct(productDTO);
                return ResponseEntity.status(HttpStatus.CREATED).body(new MessageReponse("add successfully",1,createProductDTO));
            } catch (Exception e){
                return ResponseEntity.badRequest().body(new MessageReponse(e.getMessage(),0,null));
            }
    }
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable int id,@Valid @ModelAttribute ProductDTO productDTO,BindingResult result){

        try {
            if(result.hasErrors()){
                List<String> message =result.getFieldErrors().stream().map(FieldError::getDefaultMessage).toList();
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(message);
            }
            ProductDTO productDTOUpdate = productService.updatedProduct(id,productDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(new MessageReponse("updated successfully",1,productDTOUpdate));
        } catch (Exception e){
            return ResponseEntity.badRequest().body(new MessageReponse(e.getMessage(),0,null));
        }
    }
    @DeleteMapping("/delete")
    public ResponseEntity deleteProduct(@RequestParam Integer id){
        try {
            productService.deletedProduct(id);
            return ResponseEntity.ok("deleted successfully");
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @GetMapping("/findById")
    public ResponseEntity<MessageReponse> findById(@RequestParam int id){
        try {
            ProductDTO productDTO = productService.findById(id);
            if (productDTO == null) {
                return ResponseEntity.ok(new MessageReponse("Payment not found",0 , null));
            }
            return ResponseEntity.ok(new MessageReponse("Payment found successfully",1 , productDTO));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageReponse("Error occurred: " + e.getMessage(), 0, null));
        }
    }

}
