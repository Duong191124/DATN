package com.example.demo.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PromotionResponse {
    private int id;

    private String name;

    private String description;

    private LocalDateTime startDate;

    private LocalDateTime endDate;

    private String discountPercent;

    private String discountAmount;

    private int status;

    private Integer productDetails;

    public static PromotionResponse fromPromotionResponse(Promotion promotion){
        return PromotionResponse
                .builder()
                .id(promotion.getId())
                .name(promotion.getName())
                .description(promotion.getDescription())
                .startDate(promotion.getStartDate())
                .endDate(promotion.getEndDate())
                .discountAmount(promotion.getDiscountAmount())
                .discountPercent(promotion.getDiscountPercent())
                .status(promotion.getStatus())
                .productDetails(promotion.getProductDetails()
                        .stream()
                        .findFirst()
                        .map(ProductDetail::getId).orElse(null))
                .build();
    }
}

