package com.example.demo.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Builder
@Getter @Setter
public class PageProductResponse {
    private List<ProductResponse> productResponseList;
    private int page;
    private int pageSize;
    private long totalElement;
}
