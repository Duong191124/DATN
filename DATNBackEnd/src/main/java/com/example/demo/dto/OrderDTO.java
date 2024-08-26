package com.example.demo.dto;

import com.example.demo.entity.*;
import com.example.demo.repository.AccountRepo;
import com.example.demo.repository.CustomerRepo;
import com.example.demo.repository.VoucherRepo;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;
import java.util.Optional;

@Data
@Builder
public class OrderDTO {
    private int id;
    @Enumerated(EnumType.STRING)
    private OrderStatus status;
    @DateTimeFormat(pattern = "dd/MM/yyyy")
    @JsonFormat(pattern = "dd/MM/yyyy")
    @NotNull(message = "check order date, please!")
    private Date orderDate;
    @NotNull(message = "check delivery fee, please!")
    @Min(value = 0,message = "delivery fee is not valid")
    private Double deliveryFee;
    @Min(value = 0,message = "total amount is not valid!")
    @NotNull(message = "check total amount, please!")
    private Double totalAmount;
    private String voucherDiscount;
    private String customerName;
    private String accountName;

    public static OrderDTO convertDTO(Orders orders){
        return OrderDTO.builder()
                .id(orders.getId())
                .status(orders.getStatus())
                .orderDate(orders.getOrderDate())
                .accountName(orders.getAccount().getName())
                .deliveryFee(orders.getDeliveryFee())
                .totalAmount(orders.getTotalAmount())
                .voucherDiscount(orders.getVoucher().getDiscountPercent())
                .customerName(orders.getCustomer().getName())
                .build();
    }
    public static Orders convertOrder(OrderDTO orderDTO, CustomerRepo customerRepo, VoucherRepo voucherRepo, AccountRepo accountRepo) {
        Customer customer = customerRepo.findByName(orderDTO.getCustomerName()).orElse(Customer.builder().name(orderDTO.getCustomerName()).build());
        Account account = accountRepo.findByName(orderDTO.getAccountName()).orElse(Account.builder().name(orderDTO.getAccountName()).build());
        Voucher voucher = voucherRepo.findByDiscountPercent(orderDTO.getVoucherDiscount()).orElse(Voucher.builder().discountPercent(orderDTO.getVoucherDiscount()).build());
        return Orders.builder()
                .id(orderDTO.getId())
                .orderDate(orderDTO.getOrderDate())
                .status(orderDTO.getStatus())
                .account(account)
                .customer(customer)
                .deliveryFee(orderDTO.getDeliveryFee())
                .totalAmount(orderDTO.getTotalAmount())
                .voucher(voucher)
                .build();
    }
}
