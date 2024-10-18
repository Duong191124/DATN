package com.example.demo.response;

import com.example.demo.entity.Color;
import com.example.demo.entity.ProductDetail;
import com.example.demo.entity.Size;
import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Data
public class ProductDetailResponse {
    private Integer id;
    private String code;
    private int quantity;
    private Double price;
    private String image;
    private String productName;
    private String sizeName;
    private String colorName;

    public static ProductDetailResponse fromProductDetailResponse(ProductDetail productDetail){
        return ProductDetailResponse.builder()
                .id(productDetail.getId())
                .code(productDetail.getCode())
                .quantity(productDetail.getQuantity())
                .price(productDetail.getPrice())
                .image(productDetail.getImage())
                .productName(productDetail.getProduct().getName())
                .sizeName(productDetail.getSize().getName())
                .colorName(productDetail.getColor().getName())
                .build();
    }
}
