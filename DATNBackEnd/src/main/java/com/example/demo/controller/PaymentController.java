package com.example.demo.controller;

import com.example.demo.dto.PaymentDTO;
import com.example.demo.response.MessageReponse;
import com.example.demo.response.PaymentResponse;
import com.example.demo.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.prefix}/payments")
public class PaymentController {
    @Autowired
    PaymentService paymentService;
    @GetMapping("list")
    public ResponseEntity<?> getAllPayment(){
        List<PaymentResponse> paymentResponses = paymentService.getAll();
        if(paymentResponses.isEmpty()){
            return ResponseEntity.ok(new MessageReponse("failed",400,null));
        }
        return ResponseEntity.ok(new MessageReponse("success",200,paymentResponses)) ;
    }
    @PostMapping("/add")
    public ResponseEntity<?> addPayment(@Valid @RequestBody PaymentDTO paymentDTO, BindingResult result){
        try {
            if(result.hasErrors()){
                List<String> messageError = result.getFieldErrors().stream().map(FieldError::getDefaultMessage).toList();
                return ResponseEntity.badRequest().body(messageError);
            }
            PaymentResponse paymentResponse = paymentService.createdPayment(paymentDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(new MessageReponse("added successfully",201,paymentResponse));
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updatePayment(@PathVariable int id,@Valid @RequestBody PaymentDTO paymentDTO,BindingResult result){

        try {
            if(result.hasErrors()){
                List<String> messageError = result.getFieldErrors().stream().map(FieldError::getDefaultMessage).toList();
                return ResponseEntity.badRequest().body(messageError);
            }
            PaymentResponse paymentResponse = paymentService.updatedPayment(id,paymentDTO);
            return ResponseEntity.ok(new MessageReponse("updated successfully",200,paymentResponse));
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @DeleteMapping("/delete")
    public ResponseEntity<?> deletePayment(@RequestParam int id){
        try {
            paymentService.deletedPayment(id);
            return ResponseEntity.ok(new MessageReponse("deleted successfully",200,null));
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @GetMapping("/findById")
    public ResponseEntity<?> findById(@RequestParam int id){
        try {
            PaymentResponse paymentFind = paymentService.findById(id);
            if (paymentFind == null) {
                return ResponseEntity.ok(new MessageReponse("Payment not found",400 , null));
            }
            return ResponseEntity.ok(new MessageReponse("Payment found successfully",200 , paymentFind));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageReponse("Error occurred: " + e.getMessage(), 400, null));
        }
    }

}
