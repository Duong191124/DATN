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
    private List<Integer> customers;

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

        // Kiểm tra và gán danh sách khách hàng
        if (voucher.getCustomers() != null && !voucher.getCustomers().isEmpty()) {
            response.setCustomers(
                    voucher.getCustomers() // Giả sử thuộc tính là getCustomers()
                            .stream()
                            .map(Customer::getId)
                            .collect(Collectors.toList()));
        } else {
            response.setCustomers(new ArrayList<>()); // Trả về một mảng rỗng
        }

        return response;
    }


}
