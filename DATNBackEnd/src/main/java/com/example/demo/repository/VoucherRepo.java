package com.example.demo.repository;

import com.example.demo.entity.Voucher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface VoucherRepo extends JpaRepository<Voucher,Integer> {
    @Modifying
    @Query("UPDATE Voucher v SET v.status = 0 WHERE v.expirationDate < :currentDate AND v.status != 0")
    void updateExpiredVouchers(@Param("currentDate") LocalDateTime currentDate);

}
