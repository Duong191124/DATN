package com.example.demo.request;

import lombok.*;

import java.util.List;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderWithVoucherAndOrderDetailRequest {
    private List<OrderDetailRequest> orderDetailRequests;
    private Integer voucherId;
    private Double total;
}
