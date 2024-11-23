package com.example.demo.response;

import lombok.*;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Data
public class TopSellingProductsAttributesResponse {
    private String productCode;
    private String productName;
    private String color;
    private String size;
    private Long totalSold;
}
