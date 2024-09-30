package com.example.demo.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CollarDTO {
    private String code;

    private String name;

    private int status;
}
