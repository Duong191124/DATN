package com.example.demo.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class VoucherDTO {
    @NotNull(message = "Code is required")
    @Size(max = 255, message = "Code cannot exceed 255 characters")
    private String code;

    @NotNull(message = "Discount amount is required")
    @Size(max = 255, message = "Discount amount cannot exceed 255 characters")
    @Pattern(regexp = "^[0-9]+(\\.[0-9]{1,2})?$", message = "Discount amount must be a valid number")
    private String discountAmount;

    @NotNull(message = "Discount percent is required")
    @Size(max = 255, message = "Discount percent cannot exceed 255 characters")
    @Pattern(regexp = "^(100|\\d{1,2})(\\.\\d{1,2})?$", message = "Discount percent must be a valid percentage")
    private String discountPercent;

    @NotNull(message = "Expiration date is required")
    @Future(message = "Expiration date must be a future date")
    private Date expirationDate;

    @NotNull(message = "Minimum purchase amount is required")
    @Size(max = 255, message = "Minimum purchase amount cannot exceed 255 characters")
    @Pattern(regexp = "^[0-9]+(\\.[0-9]{1,2})?$", message = "Minimum purchase amount must be a valid number")
    private String minPurchaseAmount;

    @NotNull(message = "Maximum discount amount is required")
    @Size(max = 255, message = "Maximum discount amount cannot exceed 255 characters")
    @Pattern(regexp = "^[0-9]+(\\.[0-9]{1,2})?$", message = "Maximum discount amount must be a valid number")
    private String maxDiscountAmount;

    @Size(max = 255, message = "Terms and conditions cannot exceed 255 characters")
    private String termsAndConditions;

    @NotNull(message = "Status is required")
    @Min(value = 0, message = "Status must be 0 or greater")
    @Max(value = 1, message = "Status must be 1 or less")
    private Integer status;
}
