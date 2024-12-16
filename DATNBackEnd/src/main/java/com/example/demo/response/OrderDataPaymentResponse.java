package com.example.demo.response;

import com.example.demo.dto.AddressOrderDTO;
import com.example.demo.entity.OrderStatus;
import com.example.demo.entity.OrderType;
import com.example.demo.entity.Orders;
import com.fasterxml.jackson.databind.ObjectMapper;
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
    private String code;
    @Enumerated(EnumType.STRING)
    private OrderStatus status;
    private LocalDate orderDate;
    private Double deliveryFee;
    private Double totalAmount;
    private Double moneyReceived;
    private Integer voucherId;
    @Enumerated(EnumType.STRING)
    private OrderType orderType;
    private StaffResponse staffResponse;
    private CustomerResponse customerResponse;
    private AddressOrderDTO address;
    private List<OrderDetailResponse> orderDetailResponses = new ArrayList<>();
    public static OrderDataPaymentResponse convertOrderDataPaymentResponse(Orders orders){
        AddressOrderDTO addressDTO = null;
        if (orders.getAddress() != null) {
            try {
                ObjectMapper objectMapper = new ObjectMapper();
                addressDTO = objectMapper.readValue(orders.getAddress(), AddressOrderDTO.class);
            } catch (Exception e) {
                System.err.println("Lỗi khi chuyển đổi AddressOrderDTO: " + e.getMessage());
                e.printStackTrace();
            }
        }
        return OrderDataPaymentResponse.builder()
                .id(orders.getId())
                .code(orders.getCode())
                .status(orders.getStatus())
                .orderDate(orders.getOrderDate())
                .staffResponse(orders.getStaff() != null ? StaffResponse.fromStaffResponse(orders.getStaff()) : null)
                .deliveryFee(orders.getDeliveryFee())
                .totalAmount(orders.getTotalAmount())
                .moneyReceived(orders.getMoneyReceived())
                .voucherId(orders.getVoucher() == null ? null : orders.getVoucher().getId())
                .orderDetailResponses(orders.getOrderDetails().stream().map(OrderDetailResponse::convertOrderDetailsResponse).toList())
                .orderType(orders.getOrderType())
                .customerResponse(orders.getCustomer() != null ? CustomerResponse.fromCustomerResponse(orders.getCustomer()) : null)
                .address(addressDTO)
                .build();
    }
}
