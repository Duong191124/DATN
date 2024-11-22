package com.example.demo.response;

import lombok.*;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Data
public class TotalQuantityProductStatisticsResponse {
    private String productName;
    private Long totalQuantity;
}
