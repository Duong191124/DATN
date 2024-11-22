package com.example.demo.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Data
public class CustomerBuyInTheMostResponse {
    private String customerName;
    private String customerPhone;
    private Long totalProductsBought;
}
