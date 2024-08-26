package com.example.demo.service;



import com.example.demo.dto.OrderDTO;
import org.hibernate.query.Order;

import java.util.List;

public interface OrderService {
    List<OrderDTO> getAll();
    OrderDTO createdOrder(OrderDTO orderDTO);
    OrderDTO updatedOrder(int id,OrderDTO orderDTO);
    void deletedOrder(Integer id);
    OrderDTO findById(Integer id);
}
