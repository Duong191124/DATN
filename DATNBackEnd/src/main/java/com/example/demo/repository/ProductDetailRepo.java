package com.example.demo.repository;

import com.example.demo.entity.ProductDetail;
import com.example.demo.response.ProductDetailResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductDetailRepo extends JpaRepository<ProductDetail,Integer> {
    Optional<ProductDetail> findByIdAndProductId(Integer productDetailId, Integer productId);
    List<ProductDetail> findByProductId(Integer productId);


}
