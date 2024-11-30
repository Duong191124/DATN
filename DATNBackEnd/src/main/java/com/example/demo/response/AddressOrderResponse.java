package com.example.demo.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AddressOrderResponse {
    private int id;

    private int city;

    private int district;

    private int fromDistrict;

    private String ward;

    private int serviceId;

    private String addressDetail;
    
}
