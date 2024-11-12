package com.example.demo.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderDetailRequest {
    @JsonProperty("product_detail_id")
    private Integer productDetailId;
    @JsonProperty("quantity")
    private int quantity;
    @JsonProperty("price")
    private double price;
}
