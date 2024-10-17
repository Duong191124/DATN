package com.example.demo.response;

import com.example.demo.entity.Customer;
import com.example.demo.entity.Voucher;
import lombok.*;

import java.util.Date;
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

    private Date expirationDate;

    private String minPurchaseAmount;

    private String maxDiscountAmount;

    private String termsAndConditions;

    private int status;

    private Integer customers;

    public static VoucherResponse fromVoucherResponse(Voucher voucher) {
        return VoucherResponse
                .builder()
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
                .customers(voucher.getCustomer() != null ? voucher.getCustomer().getId() : null) // Nếu customer không null
                .build();
    }


}
