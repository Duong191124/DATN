package com.example.demo.repository;

import com.example.demo.entity.Promotion;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PromotionRepo extends JpaRepository<Promotion, Integer> {
    @EntityGraph(attributePaths = "productDetails")
    Optional<Promotion> findById(Integer id);
}
