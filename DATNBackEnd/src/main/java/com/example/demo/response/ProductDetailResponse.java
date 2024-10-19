package com.example.demo.response;

import com.example.demo.entity.Color;
import com.example.demo.entity.Product;
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
    private ProductResponse productResponse;
    private Size size;
    private Color color;

    public static ProductDetailResponse fromProductDetailResponse(ProductDetail productDetail) {
        return ProductDetailResponse.builder()
                .id(productDetail.getId())
                .code(productDetail.getCode())
                .quantity(productDetail.getQuantity())
                .price(productDetail.getPrice())
                .image(productDetail.getImage())
                .productResponse(ProductResponse.convertResponse(productDetail.getProduct()))
                .size(productDetail.getSize())
                .color(productDetail.getColor())
                .build();
    }
}
