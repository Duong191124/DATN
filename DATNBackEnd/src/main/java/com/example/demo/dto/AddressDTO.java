package com.example.demo.dto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Data
@Builder
public class AddressDTO {

    private String name;

    private String phoneNumber;

    private int city;

    private int district;

    private String ward;

    private String addressDetail;

    private int customerId;
}
