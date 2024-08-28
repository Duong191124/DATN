package com.example.demo.dto;

import com.example.demo.entity.Account;
import com.example.demo.entity.Orders;
import com.example.demo.entity.Product;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Data
@Builder
public class CartDetailDTO {
    private String quantity;

    private Double price;

    private Double totalPrice;

    private Account account;

    private Product product;

    private Orders orders;
}
