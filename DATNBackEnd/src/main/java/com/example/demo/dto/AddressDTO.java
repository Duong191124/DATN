package com.example.demo.dto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Data
@Builder
public class AddressDTO {
    private String city;

    private String district;

    private String ward;

    private int customerId;
}
