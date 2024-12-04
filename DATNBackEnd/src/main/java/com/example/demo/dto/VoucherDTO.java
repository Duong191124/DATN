package com.example.demo.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class VoucherDTO {

    private String code;

    private String discountAmount;

    private int quantity;

    private String discountPercent;

    private LocalDateTime expirationDate;

    private String minPurchaseAmount;

    private String maxDiscountAmount;

    private String termsAndConditions;

    private int status;

}
