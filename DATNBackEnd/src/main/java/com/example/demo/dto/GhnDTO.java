package com.example.demo.dto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Data
@Builder
public class GhnDTO {
    private int fromDistrictId;
    private int toDistrictId;
    private String toWardCode;
    private int weight;
    private int serviceId;
}
