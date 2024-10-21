package com.example.demo.service.impl;

import com.example.demo.dto.PaymentDTO;
import com.example.demo.entity.OrderStatus;
import com.example.demo.entity.Orders;
import com.example.demo.entity.Payment;
import com.example.demo.repository.OrderRepo;
import com.example.demo.repository.PaymentRepo;
import com.example.demo.response.PaymentResponse;
import com.example.demo.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PaymentServiceIml implements PaymentService {
    @Autowired
    PaymentRepo paymentRepo;
    @Autowired
    OrderRepo orderRepo;
    @Override
    public List<PaymentResponse> getAll() {
        return paymentRepo.findAll().stream().map(PaymentResponse::convertPaymentResponse).toList();
    }

    @Override
    public PaymentResponse createdPayment(PaymentDTO paymentDTO) {
        try {
            Orders orders = orderRepo.findById(paymentDTO.getOrderId()).orElseThrow(()->new RuntimeException("not found order with id:"+paymentDTO.getOrderId()));
            if(!paymentDTO.getPaymentMethod().equalsIgnoreCase("ocd")){
                orders.setStatus(OrderStatus.shipped);
                orderRepo.save(orders);
            }
            paymentDTO.setOrderId(orders.getId());
            return PaymentResponse.convertPaymentResponse(paymentRepo.save(PaymentDTO.convertPayment(paymentDTO,orderRepo)));
        }catch (Exception e){
            throw new RuntimeException("not found payment"+e.getMessage());
        }
    }

    @Override
    public PaymentResponse updatedPayment(int id,PaymentDTO paymentDTO) {
        Payment payment = paymentRepo.findById(id).orElseThrow(()-> new RuntimeException("not found payment with id:"+id));
        payment.setPaymentDate(paymentDTO.getPaymentDate());
        payment.setPaymentMethod(paymentDTO.getPaymentMethod());
        Optional<Orders> orders = orderRepo.findById(paymentDTO.getOrderId());
        if(orders.isEmpty()){
            throw new RuntimeException("not found order with id:"+ paymentDTO.getOrderId());
        }
        payment.setOrders(orders.get());
        return PaymentResponse.convertPaymentResponse(paymentRepo.save(payment));
    }

    @Override
    public void deletedPayment(int id) {
        Payment payment = paymentRepo.findById(id).orElseThrow(()-> new RuntimeException("not found payment with id:"+id));
        paymentRepo.delete(payment);
    }

    @Override
    public PaymentResponse findById(Integer id) {
        return paymentRepo.findById(id).map(PaymentResponse::convertPaymentResponse).orElseThrow(()->new RuntimeException("not found payment with id:"+id));
    }
}
