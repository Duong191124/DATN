package com.example.demo.controller;

import com.example.demo.dto.PaymentDTO;
import com.example.demo.response.ApiResponse;
import com.example.demo.response.MessageReponse;
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
@RequestMapping("/api/v1/payments")
public class PaymentController {
    @Autowired
    PaymentService paymentService;
    @GetMapping("list")
    public ResponseEntity<MessageReponse> getAllPayment(){
        List<PaymentDTO> paymentDTOList = paymentService.getAll();
        if(paymentDTOList.isEmpty()){
            return ResponseEntity.ok(new MessageReponse("failed",0,null));
        }
        return ResponseEntity.ok(new MessageReponse("success",1,paymentDTOList)) ;
    }
    @PostMapping("/add")
    public ResponseEntity<?> addPayment(@Valid @ModelAttribute PaymentDTO paymentDTO, BindingResult result){
        try {
            if(result.hasErrors()){
                List<String> message =result.getFieldErrors().stream().map(FieldError::getDefaultMessage).toList();
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(message);
            }
        PaymentDTO paymentDTOAdd = paymentService.createdPayment(paymentDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(new MessageReponse("added successfully",1,paymentDTOAdd));
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updatePayment(@PathVariable int id,@Valid @ModelAttribute PaymentDTO paymentDTO,BindingResult result){

        try {
            if(result.hasErrors()){
                List<String> message =result.getFieldErrors().stream().map(FieldError::getDefaultMessage).toList();
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(message);
            }
            PaymentDTO paymentDTOUpdate = paymentService.updatedPayment(id,paymentDTO);
            return ResponseEntity.ok(new MessageReponse("updated successfully",1,paymentDTOUpdate));
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
    @GetMapping("/findById")
    public ResponseEntity<MessageReponse> findById(@RequestParam int id){
        try {
            PaymentDTO paymentFind = paymentService.findById(id);
            if (paymentFind == null) {
                return ResponseEntity.ok(new MessageReponse("Payment not found",0 , null));
            }
            return ResponseEntity.ok(new MessageReponse("Payment found successfully",1 , paymentFind));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageReponse("Error occurred: " + e.getMessage(), 0, null));
        }
    }
}
