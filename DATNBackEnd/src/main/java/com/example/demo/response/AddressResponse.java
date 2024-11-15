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

    private int city;

    private int district;

    private String ward;

    private int serviceId;

    private String addressDetail;

    private int customerId;

    public static AddressResponse fromAddressResponse(Address address) {
        return AddressResponse.builder()
                .id(address.getId())
                .city(address.getCity())
                .district(address.getDistrict())
                .ward(address.getWard())
                .serviceId(address.getServiceId())
                .addressDetail(address.getAddressDetail())
                .customerId(address.getCustomer().getId())
                .build();
    }
}
