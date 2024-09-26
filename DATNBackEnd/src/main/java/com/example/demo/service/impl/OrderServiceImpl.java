package com.example.demo.service.impl;

import com.example.demo.dto.OrderDTO;
import com.example.demo.entity.Customer;
import com.example.demo.entity.Orders;
import com.example.demo.entity.Staff;
import com.example.demo.entity.Voucher;
import com.example.demo.repository.StaffRepo;
import com.example.demo.repository.CustomerRepo;
import com.example.demo.repository.OrderRepo;
import com.example.demo.repository.VoucherRepo;
import com.example.demo.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService {
    @Autowired
    OrderRepo orderRepo;
    @Autowired
    CustomerRepo customerRepo;
    @Autowired
    StaffRepo staffRepo;
    @Autowired
    VoucherRepo voucherRepo;
    @Override
    public List<OrderDTO> getAll() {
        List<OrderDTO> orderDTOS = orderRepo.findAll().stream().map(OrderDTO::convertDTO).collect(Collectors.toList());
        if(orderDTOS.isEmpty()){
            throw new RuntimeException("order null");
        }
        return orderDTOS ;
    }

    @Override
    public OrderDTO createdOrder(OrderDTO orderDTO) {
       return OrderDTO.convertDTO(orderRepo.save(OrderDTO.convertOrder(orderDTO,customerRepo,voucherRepo,staffRepo)));
    }

    @Override
    public OrderDTO updatedOrder(int id,OrderDTO orderDTO) {
        Optional<Orders> ordersOptional = orderRepo.findById(id);
        Staff account = staffRepo.findById(orderDTO.getStaffId()).orElse(Staff.builder().id(orderDTO.getStaffId()).build());
        Voucher voucher = voucherRepo.findByDiscountPercent(orderDTO.getVoucherDiscount()).orElse(Voucher.builder().discountPercent(orderDTO.getVoucherDiscount()).build());
        Customer customer = customerRepo.findById(orderDTO.getCustomerId()).orElse(Customer.builder().id(orderDTO.getCustomerId()).build());
        if(ordersOptional.isEmpty()){
            throw new RuntimeException("not valid");
        }
        Orders orders = ordersOptional.get();
        orders.setStaff(account);
        orders.setStatus(orderDTO.getStatus());
        orders.setOrderDate(orderDTO.getOrderDate());
        orders.setDeliveryFee(orderDTO.getDeliveryFee());
        orders.setTotalAmount(orderDTO.getTotalAmount());
        orders.setVoucher(voucher);
        orders.setCustomer(customer);
        return OrderDTO.convertDTO(orderRepo.save(orders));
    }

    @Override
    public void deletedOrder(Integer id) {
        for (OrderDTO orderDTO: orderRepo.findAll().stream().map(OrderDTO::convertDTO).toList()
             ) {
            if(orderDTO.getId().equals(id)){
                orderRepo.deleteById(orderDTO.getId());
            }
        }
    }

    @Override
    public OrderDTO findById(Integer id) {
        return orderRepo.findById(id).map(OrderDTO::convertDTO).get();
    }
}
