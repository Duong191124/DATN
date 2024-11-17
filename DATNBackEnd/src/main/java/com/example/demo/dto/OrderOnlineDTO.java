package com.example.demo.dto;

import com.example.demo.entity.Orders;
import com.example.demo.request.OrderDetailOnlineRequest;
import com.example.demo.response.*;
import lombok.Builder;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
public class OrderOnlineDTO {
    private String code;
    private double deliveryFee;
    private double totalAmount;
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate orderDate;
    private Integer voucherId;
    private Integer customerId;
    private double moneyReceived;
    private List<OrderDetailOnlineRequest> orderDetailRequests;
    public static OrderResponse convertOrderResponse(Orders orders){
        return OrderResponse.builder()
                .id(orders.getId())
                .code(orders.getCode())
                .status(orders.getStatus())
                .orderDate(orders.getOrderDate())
                .staffResponse(orders.getStaff() != null ? StaffResponse.fromStaffResponse(orders.getStaff()) : null)
                .deliveryFee(orders.getDeliveryFee())
                .totalAmount(orders.getTotalAmount())
                .customerResponse(CustomerResponse.fromCustomerResponse(orders.getCustomer()))
                .moneyReceived(orders.getMoneyReceived())
                .voucherId(orders.getVoucher() == null ? null : VoucherResponse.fromVoucher(orders.getVoucher()))
                .orderDetailResponses(orders.getOrderDetails().stream().map(OrderDetailResponse::convertOrderDetailsResponse).toList())
                .paymentResponses(orders.getPayments().stream().map(PaymentResponse::convertPaymentResponse).toList())
                .build();
    }
}
