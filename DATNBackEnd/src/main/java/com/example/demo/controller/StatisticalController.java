package com.example.demo.controller;

import com.example.demo.dto.TopSellingProductDTO;
import com.example.demo.response.*;
import com.example.demo.service.ProductsStatisticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequiredArgsConstructor
@RequestMapping("api/v1/statistics")
public class StatisticalController {
    private final ProductsStatisticsService productsStatisticsService;
    @GetMapping("/products")
    public ResponseEntity<?> getProductsStatistics(){
        List<ProductsStatistics> productsStatisticsList = productsStatisticsService.getAllProductStatistics();
        if (productsStatisticsList.isEmpty()){
            throw new RuntimeException("Product statistics is empty");
        }
        return ResponseEntity.ok(productsStatisticsList);
    }
    @GetMapping("/top-selling-product")
    public ResponseEntity<?> getAllTopSellProduct(@RequestParam(required = false) Integer day,
                                                  @RequestParam(required = false) Integer month,
                                                  @RequestParam(required = false) Integer year
                                                  ){
        List<TopSellingProductsAttributesResponse> topSellingProductsAttributesResponses = productsStatisticsService.getAllProductsAttributes(day,month,year);
        List<TopSellingProductDTO> topSellingProductDTOS = productsStatisticsService.getAllTopSellProduct(day,month,year);
        Map<String, Object> response = new HashMap<>();
        response.put("topSellingProducts", topSellingProductDTOS);
        response.put("topSellingProductsAttributes", topSellingProductsAttributesResponses);
        return ResponseEntity.ok(response);

    }
    @GetMapping("/account")
    public ResponseEntity<?> getAllAccountStatistics(){
        AccountStatisticsResponse accountStatistics = productsStatisticsService.getAccountStats();
        return ResponseEntity.ok(accountStatistics);
    }
    @GetMapping("/products-attribute-customer")
    public ResponseEntity<?> getAllProductsWithAttributeAndCustomer(){
        List<CustomerBuyInTheMostResponse> customerTotalProductsBought = productsStatisticsService.findTopCustomersByTotalProductsBought();
        List<TotalQuantityProductsAttributeResponse> totalAttribute = productsStatisticsService.findTotalQuantityByProductSizeColor();
        List<TotalQuantityProductStatisticsResponse> totalProducts = productsStatisticsService.findTotalQuantityByProductName();
        Map<String,Object> response = new HashMap<>();
        response.put("customerBought",customerTotalProductsBought);
        response.put("totalAttribute",totalAttribute);
        response.put("totalProducts",totalProducts);
        return ResponseEntity.ok(response);
    }
}
