package com.example.demo.repository;

import com.example.demo.entity.Orders;
import com.example.demo.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentRepo extends JpaRepository<Payment,Integer> {
    Payment findByOrdersId(Integer orderId);
    Optional<Payment> findByOrders(Orders order);
}
