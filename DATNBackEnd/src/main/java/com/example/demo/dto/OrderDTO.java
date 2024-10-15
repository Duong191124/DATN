package com.example.demo.dto;

import com.example.demo.entity.OrderStatus;
import com.example.demo.entity.Orders;
import com.example.demo.entity.Staff;
import com.example.demo.entity.Voucher;
import com.example.demo.repository.StaffRepo;
import com.example.demo.repository.VoucherRepo;
import com.example.demo.request.OrderDetailRequest;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
public class OrderDTO {
    @NotBlank(message = "check code, please!")
    private String code;
    @Enumerated(EnumType.STRING)
    private OrderStatus status;
    @NotNull(message = "check delivery fee, please!")
    @Min(value = 0,message = "delivery fee is not valid")
    @JsonProperty("delivery_fee")
    private Double deliveryFee;
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate orderDate;
    @Min(value = 0,message = "total amount is not valid!")
    @NotNull(message = "check total amount, please!")
    @JsonProperty("total_amount")
    private Double totalAmount;
    @Min(value = 0,message = "total amount is not valid!")
    @JsonProperty("money_received")
    private Double moneyReceived;
    @JsonProperty("voucher_id")
    private Integer voucherId;
    @JsonProperty("staff_id")
    private Integer staffId;
    private List<OrderDetailRequest> orderDetailRequests;


    public static Orders convertOrder(OrderDTO orderDTO, VoucherRepo voucherRepo, StaffRepo accountRepo) {
        Staff staff = accountRepo.findById(orderDTO.getStaffId()).orElseThrow(()->new RuntimeException("not found staff with id:"+orderDTO.getStaffId()));
        Voucher voucher = null;
        if(voucher != null){
             voucher = voucherRepo.findById(orderDTO.getVoucherId()).orElseThrow(()->new RuntimeException("not found voucher with id:"+orderDTO.getVoucherId()));
        }
        return Orders.builder()
                .code(orderDTO.getCode())
                .status(orderDTO.getStatus())
                .staff(staff)
                .deliveryFee(orderDTO.getDeliveryFee())
                .totalAmount(orderDTO.getTotalAmount())
                .moneyReceived(orderDTO.moneyReceived)
                .voucher(voucher)
                .build();
    }
}
