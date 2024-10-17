package com.example.demo.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Data
@Builder
public class PromotionDTO {

    private String name;

    private String description;

    private LocalDateTime startDate;

    private LocalDateTime endDate;

    private String discountPercent;

    private String discountAmount;

    private int status;

    @NotNull(message = "ProductDetailsId can't null")
    private Integer productDetailsId; // Thay đổi thành Integer

}
