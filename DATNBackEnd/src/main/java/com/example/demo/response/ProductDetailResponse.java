package com.example.demo.response;

import com.example.demo.entity.Color;
import com.example.demo.entity.ProductDetail;
import com.example.demo.entity.Size;
import com.example.demo.entity.Weight;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.stream.Collectors;

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
    private Double defaultPrice;
    private Double discountPrice;
    private String image;
    private int status;
    private ProductResponse productResponse;
    private Size size;
    private Color color;
    private Weight weight;
    private Set<PromotionResponse> promotions;
    private LocalDateTime createAt;

    public static ProductDetailResponse fromProductDetailResponse(ProductDetail productDetail){
        return ProductDetailResponse.builder()
                .id(productDetail.getId())
                .code(productDetail.getCode())
                .status(productDetail.getStatus())
                .quantity(productDetail.getQuantity())
                .defaultPrice(productDetail.getDefaultPrice())
                .discountPrice(productDetail.getDiscountPrice()!=null?productDetail.getDiscountPrice():0)
                .image(productDetail.getImage())
                .productResponse(ProductResponse.convertResponse(productDetail.getProduct()))
                .size(productDetail.getSize())
                .color(productDetail.getColor())
                .weight(productDetail.getWeight())
                .promotions(productDetail.getPromotions().stream().map(PromotionResponse::fromPromotionResponse).collect(Collectors.toSet()))
                .createAt(productDetail.getCreatedAt())
                .build();
    }
}