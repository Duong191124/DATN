package com.example.demo.dto;

import lombok.Data;

@Data
public class AddressUpdateDTO {
    private int city;
    private int district;
    private String ward;
    private int serviceId;
    private String addressDetail;
}
