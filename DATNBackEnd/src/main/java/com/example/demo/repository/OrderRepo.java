package com.example.demo.repository;

import com.example.demo.entity.Orders;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;

@Repository
public interface OrderRepo extends JpaRepository<Orders, Integer> {
    @Query("SELECT o FROM Orders o " +
            "LEFT JOIN o.staff s " +
            "WHERE (:staffName IS NULL OR :staffName = '' OR LOWER(s.name) LIKE LOWER(CONCAT('%', :staffName, '%'))) " +
            "AND (:startDate IS NULL OR o.orderDate >= :startDate) " +
            "AND (:endDate IS NULL OR o.orderDate <= :endDate)")
    Page<Orders> pageAll(@Param("staffName") String staffName,
                         @Param("startDate") Date startDate,
                         @Param("endDate") Date endDate,
                         Pageable pageable);
}
