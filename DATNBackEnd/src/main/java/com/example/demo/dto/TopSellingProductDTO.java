package com.example.demo.dto;

import lombok.*;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Data
public class TopSellingProductDTO {
    private String productCode;
    private String productName;
    private Long totalSold;
}
