package com.example.demo.response;

import com.example.demo.entity.Customer;
import com.example.demo.entity.Voucher;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class VoucherResponse {
    private int id;
    private String code;
    private int quantity;
    private String discountAmount;
    private String discountPercent;
    private LocalDateTime expirationDate;
    private String minPurchaseAmount;
    private String maxDiscountAmount;
    private String termsAndConditions;
    private int status;

    public static VoucherResponse fromVoucher(Voucher voucher) {
        VoucherResponse response = VoucherResponse.builder()
                .id(voucher.getId())
                .code(voucher.getCode())
                .quantity(voucher.getQuantity())
                .discountAmount(voucher.getDiscountAmount())
                .discountPercent(voucher.getDiscountPercent())
                .expirationDate(voucher.getExpirationDate())
                .minPurchaseAmount(voucher.getMinPurchaseAmount())
                .maxDiscountAmount(voucher.getMaxDiscountAmount())
                .termsAndConditions(voucher.getTermsAndConditions())
                .status(voucher.getStatus())
                .build();

        return response;
    }


}
