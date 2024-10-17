package com.example.demo.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class VoucherDTO {
    @NotBlank(message = "Code is required")
    @Size(max = 255, message = "Code cannot exceed 255 characters")
    private String code;

    @NotBlank(message = "Discount amount is required")
    @Size(max = 255, message = "Discount amount cannot exceed 255 characters")
    @Pattern(regexp = "^[0-9]+(\\.[0-9]{1,2})?$", message = "Discount amount must be a valid number")
    private String discountAmount;
    @NotNull(message = "Code is required")
    private int quantity;
    @NotBlank(message = "Discount percent is required")
    @Size(max = 255, message = "Discount percent cannot exceed 255 characters")
    @Pattern(regexp = "^(100|\\d{1,2})(\\.\\d{1,2})?$", message = "Discount percent must be a valid percentage")
    private String discountPercent;

    @NotNull(message = "Expiration date is required")
    @Future(message = "Expiration date must be a future date")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private Date expirationDate;

    @NotBlank(message = "Minimum purchase amount is required")
    @Size(max = 255, message = "Minimum purchase amount cannot exceed 255 characters")
    @Pattern(regexp = "^[0-9]+(\\.[0-9]{1,2})?$", message = "Minimum purchase amount must be a valid number")
    private String minPurchaseAmount;

    @NotBlank(message = "Maximum discount amount is required")
    @Size(max = 255, message = "Maximum discount amount cannot exceed 255 characters")
    @Pattern(regexp = "^[0-9]+(\\.[0-9]{1,2})?$", message = "Maximum discount amount must be a valid number")
    private String maxDiscountAmount;

    @Size(max = 255, message = "Terms and conditions cannot exceed 255 characters")
    private String termsAndConditions;


    private int status;

    private Integer customers;

}
