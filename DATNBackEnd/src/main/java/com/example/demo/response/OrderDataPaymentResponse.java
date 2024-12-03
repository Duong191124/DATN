package com.example.demo.response;

import com.example.demo.entity.OrderStatus;
import com.example.demo.entity.Orders;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
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
    private LocalDate orderDate;
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
                .staffResponse(orders.getStaff() != null ? StaffResponse.fromStaffResponse(orders.getStaff()) : null)
                .deliveryFee(orders.getDeliveryFee())
                .totalAmount(orders.getTotalAmount())
                .moneyReceived(orders.getMoneyReceived())
                .voucherId(orders.getVoucher() == null ? null : orders.getVoucher().getId())
                .orderDetailResponses(orders.getOrderDetails().stream().map(OrderDetailResponse::convertOrderDetailsResponse).toList())
                .build();
    }
}
