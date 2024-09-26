package com.example.demo.response;

import com.example.demo.entity.CartDetail;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CartDetailResponse {
    private int id;

    private int quantity;

    private Double price;

    private Double totalPrice;

    private Integer customerId;

    private Integer productDetailId;

    private Integer ordersId;

//    git clone -b develop https://github.com/Duong191124/DATN.git
    public static CartDetailResponse fromCartDetailResponse(CartDetail cartDetail){
        Integer customerId = (cartDetail.getCustomer() != null) ? cartDetail.getCustomer().getId() : null;
        Integer productDetailId = (cartDetail.getProductDetail() != null) ? cartDetail.getProductDetail().getId() : null;
        Integer ordersId = (cartDetail.getOrders() != null) ? cartDetail.getOrders().getId() : null;
        return CartDetailResponse
                .builder()
                .id(cartDetail.getId())
                .quantity(cartDetail.getQuantity())
                .price(cartDetail.getPrice())
                .totalPrice(cartDetail.getTotalPrice())
                .customerId(customerId)
                .productDetailId(productDetailId)
                .ordersId(ordersId)
                .build();
    }
}
