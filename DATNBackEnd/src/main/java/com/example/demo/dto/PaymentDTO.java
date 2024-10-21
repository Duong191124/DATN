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
    private Integer orderId;
    public static Payment convertPayment(PaymentDTO paymentDTO, OrderRepo orderRepo){
        Orders orders = orderRepo.findById(paymentDTO.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found order with id:"+paymentDTO.getOrderId()));
        return Payment.builder()
                .paymentDate(paymentDTO.getPaymentDate())
                .paymentMethod(paymentDTO.getPaymentMethod())
                .orders(orders)
                .build()
                ;
    }

}
