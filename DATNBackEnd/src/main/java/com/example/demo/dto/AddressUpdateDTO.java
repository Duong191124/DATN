package com.example.demo.dto;

import lombok.Data;

@Data
public class AddressUpdateDTO {
    private int city;
    private int district;
    private int ward;
    private String communes;
    private String addressDetail;
}
