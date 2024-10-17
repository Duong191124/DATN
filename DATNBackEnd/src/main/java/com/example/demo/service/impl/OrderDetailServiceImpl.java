package com.example.demo.service.impl;

import com.example.demo.dto.OrderDetailDTO;
import com.example.demo.entity.OrderDetail;
import com.example.demo.entity.Orders;
import com.example.demo.entity.ProductDetail;
import com.example.demo.repository.OrderDetailRepo;
import com.example.demo.repository.OrderRepo;
import com.example.demo.repository.ProductDetailRepo;
import com.example.demo.service.OrderDetailService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class OrderDetailServiceImpl implements OrderDetailService {

    private final OrderDetailRepo orderDetailRepo;
    private final OrderRepo orderRepo;
    private final ProductDetailRepo productDetailRepo;

    @Override
    public List<OrderDetail> getAll() {
        return orderDetailRepo.findAll();
    }

    @Override
    public OrderDetail add(OrderDetailDTO orderDetailDTO) {
        return orderDetailRepo.save(OrderDetailDTO.convertOrderDetail(orderDetailDTO,productDetailRepo,orderRepo));

    }

    @Override
    public OrderDetail update(Integer id, OrderDetailDTO orderDetailDTO) throws Exception {
        ProductDetail productDetail = productDetailRepo.findById(orderDetailDTO.getProductDetailId()).orElseThrow(()->new RuntimeException("Not found product detail with id:"+orderDetailDTO.getProductDetailId()));
        Orders orders = orderRepo.findById(orderDetailDTO.getOrderId()).orElseThrow(()->new RuntimeException("Not found order with id:"+orderDetailDTO.getOrderId()));
        OrderDetail orderDetail = getOrderDetailById(id);
        orderDetail.setPrice(orderDetailDTO.getPrice());
        orderDetail.setQuantity(orderDetailDTO.getQuantity());
        orderDetail.setOrders(orders);
        orderDetail.setProductDetail(productDetail);
        return orderDetailRepo.save(orderDetail);
    }

    @Override
    public void delete(Integer id) throws Exception {
        OrderDetail orderDetail = getOrderDetailById(id);
        orderDetailRepo.delete(orderDetail);
    }

    @Override
    public OrderDetail getOrderDetailById(Integer id) throws Exception {
        return null;
    }
}
