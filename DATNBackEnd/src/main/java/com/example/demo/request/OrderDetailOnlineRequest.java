package com.example.demo.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderDetailOnlineRequest {
    private Integer productDetailId;
    private int quantity;
    private double price;
}
