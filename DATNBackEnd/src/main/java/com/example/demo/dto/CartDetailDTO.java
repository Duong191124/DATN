package com.example.demo.dto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Data
@Builder
public class CartDetailDTO {
    private int quantity;

    private Double price;

    private Double totalPrice;

    private Integer customerId;

    private Integer productDetailId;

    private Integer ordersId;
}
