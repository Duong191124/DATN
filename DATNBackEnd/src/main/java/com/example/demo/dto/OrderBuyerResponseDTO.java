package com.example.demo.dto;

import com.example.demo.entity.OrderStatus;
import com.example.demo.entity.Orders;
import com.example.demo.response.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
public class OrderBuyerResponseDTO {
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
    private AddressOrderDTO address;
    private String trackingId;
    private List<ProductDetailResponse> productDetailResponses = new ArrayList<>();
    private List<OrderDetailBuyerResponse> orderDetailResponses = new ArrayList<>();
    private List<PaymentResponse> paymentResponses = new ArrayList<>();
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;


    public static OrderBuyerResponseDTO convertOrderResponse(Orders orders){
        AddressOrderDTO addressDTO = null;
        if (orders.getAddress() != null) {
            try {
                ObjectMapper objectMapper = new ObjectMapper();
                addressDTO = objectMapper.readValue(orders.getAddress(), AddressOrderDTO.class);
            } catch(Exception e){
                e.printStackTrace();
            }
        }
        return OrderBuyerResponseDTO.builder()
                .id(orders.getId())
                .code(orders.getCode())
                .status(orders.getStatus())
                .orderDate(orders.getOrderDate())
                .staffResponse(orders.getStaff() != null ? StaffResponse.fromStaffResponse(orders.getStaff()) : null)
                .deliveryFee(orders.getDeliveryFee())
                .totalAmount(orders.getTotalAmount())
                .trackingId(orders.getTrackingNumber())
                .customerResponse(CustomerResponse.fromCustomerResponse(orders.getCustomer()))
                .moneyReceived(orders.getMoneyReceived())
                .voucherId(orders.getVoucher() == null ? null : VoucherResponse.fromVoucher(orders.getVoucher()))
                .orderDetailResponses(orders.getOrderDetails().stream().map(OrderDetailBuyerResponse::convertOrderDetailsResponse).toList())
                .paymentResponses(orders.getPayments().stream().map(PaymentResponse::convertPaymentResponse).toList())
                .address(addressDTO)
                .createdAt(orders.getCreatedAt())
                .updatedAt(orders.getUpdatedAt())
                .build();
    }
}
