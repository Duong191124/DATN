package com.example.demo.repository;

import com.example.demo.entity.ProductDetail;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductDetailRepo extends JpaRepository<ProductDetail, Integer> {
}
