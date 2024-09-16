package com.example.demo.response;

import com.example.demo.entity.ProductDetail;
import jakarta.validation.constraints.*;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class ProductDetailResponse {

    private int id;

    private String code;

    private int quantity;

    private double price;

    private String image;

    private int productId;

    private int sizeId;

    private int colorId;

    public static ProductDetailResponse fromProductDetailResponse(ProductDetail productDetail){
        return ProductDetailResponse.builder()
                .id(productDetail.getId())
                .code(productDetail.getCode())
                .quantity(productDetail.getQuantity())
                .price(productDetail.getPrice())
                .image(productDetail.getImage())
                .productId(productDetail.getProduct().getId())
                .sizeId(productDetail.getSize().getId())
                .colorId(productDetail.getColor().getId())
                .build();
    }
}
