package com.example.demo.service.impl;

import com.example.demo.dto.PaymentDTO;
import com.example.demo.entity.Orders;
import com.example.demo.entity.Payment;
import com.example.demo.repository.OrderRepo;
import com.example.demo.repository.PaymentRepo;
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
    public List<PaymentDTO> getAll() {
        return paymentRepo.findAll().stream().map(PaymentDTO::convertDTO).toList();
    }

    @Override
    public PaymentDTO createdPayment(PaymentDTO paymentDTO) {
        try {
            return PaymentDTO.convertDTO(paymentRepo.save(PaymentDTO.convertPayment(paymentDTO,orderRepo)));
        }catch (Exception e){
            throw new RuntimeException("not found payment"+e.getMessage());
        }
    }

    @Override
    public PaymentDTO updatedPayment(int id,PaymentDTO paymentDTO) {
        Payment payment = paymentRepo.findById(id).orElseThrow(()-> new RuntimeException("not found paymentById"));
        payment.setPaymentDate(paymentDTO.getPaymentDate());
        payment.setPaymentMethod(paymentDTO.getPaymentMethod());
        Optional<Orders> orders = orderRepo.findById(paymentDTO.getOrders().getId());
        if(orders.isEmpty()){
            throw new RuntimeException("not found orderById");
        }
        payment.setOrders(orders.get());
        return PaymentDTO.convertDTO(paymentRepo.save(payment));
    }

    @Override
    public void deletedPayment(int id) {
        List<PaymentDTO> paymentDTO = paymentRepo.findAll().stream().map(PaymentDTO::convertDTO).toList();
        for (int i = 0;i < paymentDTO.size();i++){
            if(paymentDTO.get(i).getId() == id){
                paymentRepo.deleteById(paymentDTO.get(i).getId());
            }
        }
    }

    @Override
    public PaymentDTO findById(Integer id) {
        return paymentRepo.findById(id).map(PaymentDTO::convertDTO).get();
    }
}
