package com.example.demo.service;

import com.example.demo.dto.TopSellingProductDTO;
import com.example.demo.response.*;

import java.util.List;

public interface ProductsStatisticsService {
    List<ProductsStatistics> getAllProductStatistics();
    List<TopSellingProductDTO> getAllTopSellProduct(Integer day,Integer month,Integer year);
    List<TopSellingProductsAttributesResponse> getAllProductsAttributes(Integer day, Integer month, Integer year);
    AccountStatisticsResponse getAccountStats();
    List<TotalQuantityProductsAttributeResponse> findTotalQuantityByProductSizeColor();
    List<TotalQuantityProductStatisticsResponse> findTotalQuantityByProductName();
    List<CustomerBuyInTheMostResponse> findTopCustomersByTotalProductsBought();
}
