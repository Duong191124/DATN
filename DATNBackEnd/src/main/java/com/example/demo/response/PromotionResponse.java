package com.example.demo.response;

import com.example.demo.entity.ProductDetail;
import com.example.demo.entity.Promotion;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

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

    private List<Integer> productDetailsId;

    public static PromotionResponse fromPromotionResponse(Promotion promotion) {
        PromotionResponse response = PromotionResponse.builder()
                .id(promotion.getId())
                .name(promotion.getName())
                .description(promotion.getDescription())
                .startDate(promotion.getStartDate())
                .endDate(promotion.getEndDate())
                .discountAmount(promotion.getDiscountAmount())
                .discountPercent(promotion.getDiscountPercent())
                .status(promotion.getStatus())
                .build();

        // Chỉ thêm productDetailsId nếu có sản phẩm liên kết
        if (promotion.getProductDetails() != null && !promotion.getProductDetails().isEmpty()) {
            response.setProductDetailsId(
                    promotion.getProductDetails()
                            .stream()
                            .map(ProductDetail::getId)
                            .collect(Collectors.toList()));
        } else {
            response.setProductDetailsId(new ArrayList<>()); // Trả về một mảng rỗng
        }

        return response;
    }


}

