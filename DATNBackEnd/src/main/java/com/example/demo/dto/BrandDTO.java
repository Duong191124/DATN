package com.example.demo.dto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Data
@Builder
public class BrandDTO {

    private String code;

    private String name;

    private int status;
}
