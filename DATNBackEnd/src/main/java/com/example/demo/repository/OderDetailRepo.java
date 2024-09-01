package com.example.demo.repository;


import com.example.demo.entity.OrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OderDetailRepo extends JpaRepository<OrderDetail, Integer> {
}
