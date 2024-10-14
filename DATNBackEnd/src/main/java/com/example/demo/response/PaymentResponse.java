package com.example.demo.response;

import com.example.demo.entity.Payment;
import lombok.*;

import java.util.Date;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentResponse {
    private Integer id;
    private Date paymentDate;
    private String paymentMethod;
    private OrderDataPaymentResponse orderDataPaymentResponse;
    public static PaymentResponse convertPaymentResponse(Payment payment){
        return PaymentResponse.builder()
                .id(payment.getId())
                .paymentDate(payment.getPaymentDate())
                .paymentMethod(payment.getPaymentMethod())
                .orderDataPaymentResponse(OrderDataPaymentResponse.convertOrderDataPaymentResponse(payment.getOrders()))
                .build();
    }
}
