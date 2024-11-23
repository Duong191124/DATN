package com.example.demo.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Data
public class ProductsStatistics {
    private String day;
    private String month;
    private Integer year;
    private Long onlineQuantity; // Số lượng bán online
    private Long offlineQuantity; // Số lượng bán offline
    private Double onlineRevenue; // Doanh thu online
    private Double offlineRevenue;
}
