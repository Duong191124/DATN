package com.example.demo.dto;

import com.example.demo.entity.OrderDetail;
import com.example.demo.response.OrderDetailResponse;
import lombok.*;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderDetailBuyerResponse {
    private Integer id;
    private Double price;
    private Integer quantity;
    private ProductDetailBuyerDTO productDetailId;
    private Integer orderId;
    public static OrderDetailBuyerResponse convertOrderDetailsResponse(OrderDetail orderDetail){
        return OrderDetailBuyerResponse.builder()
                .id(orderDetail.getId())
                .orderId(orderDetail.getOrders().getId())
                .productDetailId(ProductDetailBuyerDTO.convertProductDetailDTO(orderDetail.getProductDetail()))
                .price(orderDetail.getPrice())
                .quantity(orderDetail.getQuantity())
                .build();
    }
}
