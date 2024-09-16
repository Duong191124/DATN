package com.example.demo.service;

import com.example.demo.dto.PaymentDTO;

import java.util.List;

public interface PaymentService {
    List<PaymentDTO> getAll();
    PaymentDTO createdPayment(PaymentDTO paymentDTO);
    PaymentDTO updatedPayment(int id,PaymentDTO paymentDTO);
    void deletedPayment(int id);
    PaymentDTO findById(Integer id);
}
