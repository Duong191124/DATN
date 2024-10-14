package com.example.demo.service;



import com.example.demo.dto.OrderDTO;
import com.example.demo.response.OrderResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Date;
import java.util.List;

public interface OrderService {
    List<OrderResponse> getAll();
    OrderResponse createdOrder(OrderDTO orderDTO);
    OrderResponse updatedOrder(int id,OrderDTO orderDTO);
    OrderResponse updateStatusOrder(Integer id, String status);
    void deletedOrder(Integer id);
    OrderResponse findById(Integer id);
    Page<OrderResponse> pageAll(String staffName, Date startDate, Date endDate, Pageable pageable);
}
