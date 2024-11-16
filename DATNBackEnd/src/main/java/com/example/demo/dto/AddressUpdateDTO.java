package com.example.demo.dto;

import lombok.Data;

@Data
public class AddressUpdateDTO {
    private String name;
    private String phoneNumber;
    private int city;
    private int district;
    private String ward;
    private String addressDetail;
}
