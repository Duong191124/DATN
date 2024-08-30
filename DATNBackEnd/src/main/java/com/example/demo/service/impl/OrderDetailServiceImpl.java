package com.example.demo.service.impl;

import com.example.demo.dto.OrderDetailDTO;
import com.example.demo.entity.OrderDetail;
import com.example.demo.repository.OderDetailRepo;
import com.example.demo.service.OrderDetailService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class OrderDetailServiceImpl implements OrderDetailService {

    private final OderDetailRepo oderDetailRepo;

    @Override
    public List<OrderDetail> getAll() {
        return oderDetailRepo.findAll();
    }

    @Override
    public OrderDetail add(OrderDetailDTO orderDetailDTO) {
        OrderDetail orderDetail = OrderDetail.builder()
                .price(orderDetailDTO.getPrice())
                .quantity(orderDetailDTO.getQuantity())
                .orders(orderDetailDTO.getOrders())
                .productDetail(orderDetailDTO.getProductDetail())
                .build();
        return oderDetailRepo.save(orderDetail);

    }

    @Override
    public OrderDetail update(Integer id, OrderDetailDTO orderDetailDTO) throws Exception {
        OrderDetail orderDetail = getOrderDetailById(id);
        orderDetail.setPrice(orderDetailDTO.getPrice());
        orderDetail.setQuantity(orderDetailDTO.getQuantity());
        orderDetail.setOrders(orderDetailDTO.getOrders());
        orderDetail.setProductDetail(orderDetailDTO.getProductDetail());
        return oderDetailRepo.save(orderDetail);
    }

    @Override
    public void delete(Integer id) throws Exception {
        OrderDetail orderDetail = getOrderDetailById(id);
        oderDetailRepo.delete(orderDetail);
    }

    @Override
    public OrderDetail getOrderDetailById(Integer id) throws Exception {
        return null;
    }
}
