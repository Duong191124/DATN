package com.example.demo.response;

import com.example.demo.entity.OrderStatus;
import com.example.demo.entity.Orders;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderDataPaymentResponse {
    private Integer id;
    @Enumerated(EnumType.STRING)
    private OrderStatus status;
    private Date orderDate;
    private Double deliveryFee;
    private Double totalAmount;
    private Double moneyReceived;
    private Integer voucherId;
    private StaffResponse staffResponse;
    private List<OrderDetailResponse> orderDetailResponses = new ArrayList<>();
    public static OrderDataPaymentResponse convertOrderDataPaymentResponse(Orders orders){
        return OrderDataPaymentResponse.builder()
                .id(orders.getId())
                .status(orders.getStatus())
                .orderDate(orders.getOrderDate())
                .staffResponse(StaffResponse.fromStaffResponse(orders.getStaff()))
                .deliveryFee(orders.getDeliveryFee())
                .totalAmount(orders.getTotalAmount())
                .moneyReceived(orders.getMoneyReceived())
                .voucherId(orders.getVoucher() == null ? null : orders.getVoucher().getId())
                .orderDetailResponses(orders.getOrderDetails().stream().map(OrderDetailResponse::convertOrderDetailsResponse).toList())
                .build();
    }
}
