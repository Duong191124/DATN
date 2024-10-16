package com.example.demo.response;

import lombok.*;

import java.util.List;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderPageResponse {
    private List<OrderResponse> orderResponseList;
    private int page;
    private int pageSize;
    private int totalPage;
}
