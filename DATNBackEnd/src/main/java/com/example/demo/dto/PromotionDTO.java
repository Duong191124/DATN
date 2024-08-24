package com.example.demo.dto;

import com.example.demo.entity.ProductDetail;
import jakarta.persistence.Basic;
import jakarta.persistence.Column;
import jakarta.persistence.ManyToMany;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Set;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PromotionDTO {

    @NotBlank(message = "Name can't empty")
    private String name;

    private String description;

    private LocalDateTime startDate;

    private LocalDateTime endDate;

    @NotBlank(message = "DiscountPercent can't empty")
    private String discountPercent;

    @NotBlank(message = "DiscountAmount can't empty")
    private String discountAmount;

    private int status;

    @NotNull(message = "ProductDetails can't null")
    private Set<ProductDetail> productDetails;

}
