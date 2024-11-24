package com.example.demo.service.impl;

import com.example.demo.dto.TopSellingProductDTO;
import com.example.demo.repository.CustomerRepo;
import com.example.demo.repository.OrderRepo;
import com.example.demo.repository.ProductRepo;
import com.example.demo.repository.StaffRepo;
import com.example.demo.response.*;
import com.example.demo.service.ProductsStatisticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductsStatisticsServiceImpl implements ProductsStatisticsService {
    private final OrderRepo orderRepo;
    private final ProductRepo productRepo;
    private final StaffRepo staffRepo;
    private final CustomerRepo customerRepo;
    @Override
    public List<ProductsStatistics> getAllProductStatistics() {
        List<Object[]> results = orderRepo.getMonthProductsStatistics();
        List<ProductsStatistics> statistics = new ArrayList<>();

        for (Object[] row : results) {
            String day = (String) row[0];
            String month = (String) row[1];
            Integer year = (Integer) row[2];
            Long onlineQuantity = (row[3] != null) ? ((Number) row[3]).longValue() : 0L;
            Long offlineQuantity = (row[4] != null) ? ((Number) row[4]).longValue() : 0L;
            Double onlineRevenue = (row[5] != null) ? ((Number) row[5]).doubleValue() : 0.0;
            Double offlineRevenue = (row[6] != null) ? ((Number) row[6]).doubleValue() : 0.0;

            // Chuyển đổi kết quả thành đối tượng ProductsStatistics
            ProductsStatistics stat = new ProductsStatistics(day,month,year, onlineQuantity, offlineQuantity, onlineRevenue, offlineRevenue);
            statistics.add(stat);
        }

        return statistics;
    }

    @Override
    public List<TopSellingProductDTO> getAllTopSellProduct(Integer day, Integer month, Integer year) {
        return productRepo.findTop10SellingProducts(day,month,year).stream().limit(10).collect(Collectors.toList());
    }

    @Override
    public List<TopSellingProductsAttributesResponse> getAllProductsAttributes(Integer day, Integer month, Integer year) {
        return productRepo.findTopSellingProductsByAttributes(day,month,year);
    }

    @Override
    public AccountStatisticsResponse getAccountStats() {
        List<Object[]> statsList = staffRepo.getStaffStatistics();

        // Đảm bảo không bị null và có ít nhất một dòng
        if (statsList == null || statsList.isEmpty()) {
            throw new RuntimeException("Statistics data is empty!");
        }
        System.out.println("Stats List: " + statsList);

        // Lấy hàng đầu tiên (do query trả về một hàng duy nhất)
        Object[] stats = statsList.get(0);

        // Ép kiểu và chuyển đổi kết quả
        Long adminCount = stats[0] != null ? ((Number) stats[0]).longValue() : 0L;
        Long managerCount = stats[1] != null ? ((Number) stats[1]).longValue() : 0L;
        Long normalEmployeeCount = stats[2] != null ? ((Number) stats[2]).longValue():0L;

        return new AccountStatisticsResponse(adminCount,managerCount,normalEmployeeCount, customerRepo.countCustomer());
    }

    @Override
    public List<TotalQuantityProductsAttributeResponse> findTotalQuantityByProductSizeColor() {
        return productRepo.findTotalQuantityByProductSizeColor();
    }

    @Override
    public List<TotalQuantityProductStatisticsResponse> findTotalQuantityByProductName() {
        return productRepo.findTotalQuantityByProductName();
    }

    @Override
    public List<CustomerBuyInTheMostResponse> findTopCustomersByTotalProductsBought() {
        return customerRepo.findTopCustomersByTotalProductsBought().stream().limit(10).collect(Collectors.toList());
    }

}
