package com.example.demo.response;

import com.example.demo.entity.Payment;
import lombok.*;

import java.time.LocalDateTime;
import java.time.ZoneId;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentResponse {
    private Integer id;
    private LocalDateTime paymentDate;
    private String paymentMethod;
    private Integer status;
    private OrderDataPaymentResponse orderDataPaymentResponse;
    private String paymentUrl;

    public static PaymentResponse convertPaymentResponse(Payment payment) {
        return PaymentResponse.builder()
                .id(payment.getId())
                .paymentDate(payment.getPaymentDate().toInstant()
                        .atZone(ZoneId.of("Asia/Ho_Chi_Minh"))
                        .toLocalDateTime())
                .status(payment.getStatus())
                .paymentMethod(payment.getPaymentMethod())
                .orderDataPaymentResponse(OrderDataPaymentResponse.convertOrderDataPaymentResponse(payment.getOrders()))
                .build();
    }
    public static PaymentResponse convertPaymentResponseUrl(Payment payment,String paymentUrl) {
        if (payment == null) {
            return PaymentResponse.builder()
                    .id(null)
                    .paymentDate(null)
                    .paymentMethod(null)
                    .orderDataPaymentResponse(null)
                    .paymentUrl(paymentUrl)
                    .build();
        }
        return PaymentResponse.builder()
                .id(payment.getId())
                .paymentDate(payment.getPaymentDate().toInstant()
                        .atZone(ZoneId.of("Asia/Ho_Chi_Minh"))
                        .toLocalDateTime())
                .paymentMethod(payment.getPaymentMethod())
                .orderDataPaymentResponse(OrderDataPaymentResponse.convertOrderDataPaymentResponse(payment.getOrders()))
                .status(payment.getStatus())
                .paymentUrl(paymentUrl)
                .status(payment.getStatus())
                .build();
    }

}
