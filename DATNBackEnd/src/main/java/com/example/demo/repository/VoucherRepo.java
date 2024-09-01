package com.example.demo.repository;

import com.example.demo.entity.Voucher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VoucherRepo extends JpaRepository<Voucher,Integer> {
    Optional<Voucher> findByDiscountPercent(String name);
}
