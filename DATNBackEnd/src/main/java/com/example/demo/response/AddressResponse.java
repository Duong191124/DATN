package com.example.demo.response;

import com.example.demo.entity.Address;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AddressResponse {
    private int id;

    private String city;

    private String district;

    private String ward;

    private int customerId;

    public static AddressResponse fromAddressResponse(Address address) {
        return AddressResponse.builder()
                .id(address.getId())
                .city(address.getCity())
                .district(address.getDistrict())
                .ward(address.getWard())
                .customerId(address.getCustomer().getId())
                .build();
    }
}
