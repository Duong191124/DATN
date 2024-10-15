package com.example.demo.dto;

import com.example.demo.entity.OrderDetail;
import com.example.demo.entity.Orders;
import com.example.demo.entity.ProductDetail;
import com.example.demo.repository.OrderRepo;
import com.example.demo.repository.ProductDetailRepo;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderDetailDTO {
    private Integer id;
    private Double price;
    private Integer quantity;
    @JsonProperty("product_detail_id")
    private Integer productDetailId;
    @JsonProperty("order_id")
    private Integer orderId;


    public static OrderDetail convertOrderDetail(OrderDetailDTO orderDetailDTO, ProductDetailRepo productDetailRepo, OrderRepo orderRepo){
        ProductDetail productDetail = productDetailRepo.findById(orderDetailDTO.getProductDetailId()).orElseThrow(()->new RuntimeException("Not found product detail with id:"+orderDetailDTO.getProductDetailId()));
        Orders orders = orderRepo.findById(orderDetailDTO.getOrderId()).orElseThrow(()->new RuntimeException("Not found order with id:"+orderDetailDTO.getOrderId()));
        return OrderDetail.builder()
                .id(orderDetailDTO.getId())
                .price(orderDetailDTO.getPrice())
                .quantity(orderDetailDTO.getQuantity())
                .productDetail(productDetail)
                .orders(orders)
                .build();
    }
}
