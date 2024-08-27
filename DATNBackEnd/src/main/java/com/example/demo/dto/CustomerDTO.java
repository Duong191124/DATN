package com.example.demo.dto;

import com.example.demo.entity.Voucher;
import lombok.*;

import java.util.Set;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CustomerDTO {
    private String name;

    private String phoneNumber;

    private int gender;

    private String email;

    private String address;

    private Set<Voucher> vouchers;
}
