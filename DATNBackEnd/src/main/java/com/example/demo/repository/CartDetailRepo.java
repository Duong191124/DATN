package com.example.demo.repository;

import com.example.demo.entity.CartDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CartDetailRepo extends JpaRepository<CartDetail, Integer> {
    List<CartDetail> findByCustomerId(int customerId);
}
