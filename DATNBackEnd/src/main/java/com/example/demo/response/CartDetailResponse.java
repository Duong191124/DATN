package com.example.demo.response;

import com.example.demo.entity.CartDetail;
import com.example.demo.entity.Customer;
import com.example.demo.entity.ProductDetail;
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

    private Customer customer;

    private ProductDetail productDetail;

    public static CartDetailResponse fromCartDetailResponse(CartDetail cartDetail){
//        Integer customerId = (cartDetail.getCustomer() != null) ? cartDetail.getCustomer().getId() : null;
//        Integer productDetailId = (cartDetail.getProductDetail() != null) ? cartDetail.getProductDetail().getId() : null;
        return CartDetailResponse
                .builder()
                .id(cartDetail.getId())
                .quantity(cartDetail.getQuantity())
                .price(cartDetail.getPrice())
                .totalPrice(cartDetail.getTotalPrice())
                .customer(cartDetail.getCustomer())
                .productDetail(cartDetail.getProductDetail())
                .build();
    }
}
