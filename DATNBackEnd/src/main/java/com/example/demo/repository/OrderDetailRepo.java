package com.example.demo.repository;


import com.example.demo.entity.OrderDetail;
import com.example.demo.entity.Orders;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface OrderDetailRepo extends JpaRepository<OrderDetail, Integer> {
    @Query("SELECT pd, COALESCE(SUM(od.quantity), 0) " +
            "FROM ProductDetail pd " +
            "JOIN pd.promotions p " +
            "LEFT JOIN OrderDetail od ON od.productDetail.id = pd.id " +
            "WHERE pd.discountPrice IS NOT NULL AND pd.discountPrice > 0 " +
            "GROUP BY pd.id " +
            "ORDER BY pd.createdAt DESC, COALESCE(SUM(od.quantity), 0) DESC, pd.discountPrice ASC")
    List<Object[]> getTopFeaturedProducts(Pageable pageable);


    List<OrderDetail> findByOrders(Orders orders);

    @Query("SELECT SUM(od.quantity) FROM OrderDetail od JOIN od.orders o WHERE od.productDetail.id = :productDetailId AND o.status = 'shipped'")
    Integer getTotalSoldForProductDetail(@Param("productDetailId") Integer productDetailId);


}
