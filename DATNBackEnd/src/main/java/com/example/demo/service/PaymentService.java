package com.example.demo.service;

import com.example.demo.dto.PaymentDTO;
import com.example.demo.entity.Payment;
import com.example.demo.response.PaymentResponse;

import java.io.UnsupportedEncodingException;
import java.util.List;

public interface PaymentService {
    List<PaymentResponse> getAll();
    PaymentResponse createdPayment(PaymentDTO paymentDTO);
    PaymentResponse updatedPayment(int id,PaymentDTO paymentDTO);
    void deletedPayment(int id);
    PaymentResponse findById(Integer id);
    Payment findByOrdersId(Integer orderId);
    String createPaymentUrl(String uniqueId, long amount) throws UnsupportedEncodingException;
}
