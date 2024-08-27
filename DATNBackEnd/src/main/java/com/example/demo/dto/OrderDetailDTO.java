package com.example.demo.dto;

import com.example.demo.entity.OrderDetail;
import com.example.demo.entity.Orders;
import com.example.demo.entity.ProductDetail;
import jakarta.validation.Valid;
import lombok.*;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderDetailDTO {

    private Double price;

    private Integer quantity;

    private Orders orders;

    private ProductDetail productDetail;

}
