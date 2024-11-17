package com.example.demo.response;

import com.example.demo.entity.OrderStatus;
import com.example.demo.entity.Orders;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderResponse {
    private Integer id;
    private String code;
    @Enumerated(EnumType.STRING)
    private OrderStatus status;
    @DateTimeFormat(pattern = "dd-MM-yyyy")
    private LocalDate orderDate;
    private Double deliveryFee;
    private Double totalAmount;
    private Double moneyReceived;
    private VoucherResponse voucherId;
    private StaffResponse staffResponse;
    private CustomerResponse customerResponse;
    private List<OrderDetailResponse> orderDetailResponses = new ArrayList<>();
    private List<PaymentResponse> paymentResponses = new ArrayList<>();
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;


    public static OrderResponse convertOrderResponse(Orders orders){
        return OrderResponse.builder()
                .id(orders.getId())
                .code(orders.getCode())
                .status(orders.getStatus())
                .orderDate(orders.getOrderDate())
                .staffResponse(StaffResponse.fromStaffResponse(orders.getStaff()))
                .deliveryFee(orders.getDeliveryFee())
                .totalAmount(orders.getTotalAmount())
                .customerResponse(CustomerResponse.fromCustomerResponse(orders.getCustomer()))
                .moneyReceived(orders.getMoneyReceived())
                .voucherId(orders.getVoucher() == null ? null : VoucherResponse.fromVoucher(orders.getVoucher()))
                .orderDetailResponses(orders.getOrderDetails().stream().map(OrderDetailResponse::convertOrderDetailsResponse).toList())
                .paymentResponses(orders.getPayments().stream().map(PaymentResponse::convertPaymentResponse).toList())
                .createdAt(orders.getCreatedAt())
                .updatedAt(orders.getUpdatedAt())
                .build();
    }
}
