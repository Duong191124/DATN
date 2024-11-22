package com.example.demo.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Data
public class TotalQuantityProductsAttributeResponse {
    private String productName;
    private String sizeName;
    private String colorName;
    private Long totalQuantity;
}
