package com.example.demo.controller;

import com.example.demo.dto.PaymentDTO;
import com.example.demo.response.ApiResponse;
import com.example.demo.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/payments")
public class PaymentController {
    @Autowired
    PaymentService paymentService;
    @GetMapping("list")
    public ResponseEntity<ApiResponse<List<PaymentDTO>>> getAllPayment(){
        List<PaymentDTO> paymentDTOList = paymentService.getAll();
        if(paymentDTOList.isEmpty()){
            return ResponseEntity.ok(new ApiResponse<>(false,"failed",null));
        }
        return ResponseEntity.ok(new ApiResponse<>(true,"success",paymentDTOList)) ;
    }
    @PostMapping("/add")
    public ResponseEntity<ApiResponse<PaymentDTO>> addPayment(@Valid @RequestBody PaymentDTO paymentDTO){
        PaymentDTO paymentDTOAdd = paymentService.createdPayment(paymentDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse<>(true,"added successfully",paymentDTOAdd));
    }
    @PutMapping("/update/{id}")
    public ResponseEntity<ApiResponse<PaymentDTO>> updatePayment(@PathVariable int id,@Valid @RequestBody PaymentDTO paymentDTO){
        PaymentDTO paymentDTOUpdate = paymentService.updatedPayment(id,paymentDTO);
        return ResponseEntity.ok(new ApiResponse<>(true,"updated successfully",paymentDTOUpdate));
    }
    @DeleteMapping("/delete")
    public ResponseEntity deletePayment(@RequestParam int id){
        paymentService.deletedPayment(id);
        return ResponseEntity.ok(new ApiResponse(true,"deleted successfully",null));
    }
    @GetMapping("/findById")
    public ResponseEntity<ApiResponse<PaymentDTO>> findById(@RequestParam int id){
        try {
            PaymentDTO paymentFind = paymentService.findById(id);
            if (paymentFind == null) {
                return ResponseEntity.ok(new ApiResponse<>(false, "Payment not found", null));
            }
            return ResponseEntity.ok(new ApiResponse<>(true, "Payment found successfully", paymentFind));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Error occurred: " + e.getMessage(), null));
        }
    }
}
