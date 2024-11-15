package com.example.demo.dto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Data
@Builder
public class AddressDTO {
    private int city;

    private int district;

    private int ward;

    private String communes;

    private String addressDetail;

    private int customerId;
}
