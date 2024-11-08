package com.example.demo.service;



import com.example.demo.dto.OrderDTO;
import com.example.demo.entity.OrderStatus;
import com.example.demo.request.OrderDetailRequest;
import com.example.demo.response.OrderResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;

public interface OrderService {
    List<OrderResponse> getAll();
    OrderResponse createdOrder(OrderDTO orderDTO);
    OrderResponse updatedOrder(int id,OrderDTO orderDTO);
    OrderResponse updateStatusOrder(Integer id, String status);
    void deletedOrder(Integer id);
    OrderResponse findById(Integer id);
    OrderResponse findByCode(String code);
    OrderResponse updatedOrderWithProductDetail(Integer id,List<OrderDetailRequest> orderDetailRequests);
    Page<OrderResponse> pageAll(String staffName, LocalDate startDate, LocalDate  endDate, OrderStatus orderStatus, String orderCode, Pageable pageable);
    List<OrderResponse> getPendingOrdersByStaff(Integer staffId);
}
