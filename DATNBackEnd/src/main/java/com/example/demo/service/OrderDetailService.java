package com.example.demo.service;

import com.example.demo.dto.OrderDetailDTO;
import com.example.demo.entity.OrderDetail;

import java.util.List;

public interface OrderDetailService {
    List<OrderDetail> getAll();

    OrderDetail add(OrderDetailDTO orderDetailDTO);

    OrderDetail update(Integer id, OrderDetailDTO orderDetailDTO)throws  Exception;

    void delete(Integer id)throws  Exception;

    OrderDetail getOrderDetailById(Integer id) throws Exception;
}
