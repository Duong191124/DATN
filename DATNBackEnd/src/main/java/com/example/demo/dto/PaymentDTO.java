package com.example.demo.dto;

import com.example.demo.entity.Orders;
import com.example.demo.entity.Payment;
import com.example.demo.repository.OrderRepo;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

@Data
@Builder
public class PaymentDTO {
    private Integer id;
    @DateTimeFormat(pattern = "dd/MM/yyyy")
    @JsonFormat(pattern = "dd/MM/yyyy")
    @NotNull(message = "check payment date, please!")
    private Date paymentDate;
    @NotBlank(message = "check payment method, please!")
    private String paymentMethod;
    private Orders orders;

    public static PaymentDTO convertDTO(Payment payment){
        return PaymentDTO.builder()
                .id(payment.getId())
                .paymentDate(payment.getPaymentDate())
                .paymentMethod(payment.getPaymentMethod())
                .orders(payment.getOrders())
                .build()
                ;
    }
    public static Payment convertPayment(PaymentDTO paymentDTO, OrderRepo orderRepo){
        if (paymentDTO == null || paymentDTO.getOrders() == null) {
            throw new IllegalArgumentException("PaymentDTO or Orders cannot be null");
        }
        Orders orders = orderRepo.findById(paymentDTO.getOrders().getId())
                .orElseThrow(() -> new RuntimeException("Order not found"));
        return Payment.builder()
                .paymentDate(paymentDTO.getPaymentDate())
                .paymentMethod(paymentDTO.getPaymentMethod())
                .orders(orders)
                .build()
                ;
    }

}
