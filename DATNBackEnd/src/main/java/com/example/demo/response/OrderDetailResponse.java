package com.example.demo.response;

import com.example.demo.dto.ProductDetailDTO;
import com.example.demo.entity.OrderDetail;
import lombok.*;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderDetailResponse {
    private Integer id;
    private Double price;
    private Integer quantity;
    private ProductDetailDTO productDetailId;
    private Integer orderId;
    public static OrderDetailResponse convertOrderDetailsResponse(OrderDetail orderDetail){
        return OrderDetailResponse.builder()
                .id(orderDetail.getId())
                .orderId(orderDetail.getOrders().getId())
                .productDetailId(ProductDetailDTO.convertProductDetailDTO(orderDetail.getProductDetail()))
                .price(orderDetail.getPrice())
                .quantity(orderDetail.getQuantity())
                .build();
    }
}
