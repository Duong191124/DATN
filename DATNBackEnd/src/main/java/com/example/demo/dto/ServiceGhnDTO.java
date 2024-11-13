package com.example.demo.dto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Data
@Builder
public class ServiceGhnDTO {
    private int shopId;
    private int fromDistrictID;
    private int toDistrictID;
}
