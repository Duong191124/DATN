package com.example.demo.repository;

import com.example.demo.entity.ProductDetail;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductDetailRepo extends JpaRepository<ProductDetail, Integer> {
    Optional<ProductDetail> findByIdAndProductId(Integer productDetailId, Integer productId);

    List<ProductDetail> findByProductId(Integer productId);

    @Query("SELECT pdt FROM ProductDetail pdt " +
            "JOIN pdt.product p " +
            "JOIN pdt.color cl " +
            "JOIN pdt.size s " +
            "JOIN p.sleeve sl " +
            "JOIN p.collar col " +
            "JOIN p.brand b " +
            "WHERE (:productName IS NULL OR :productName = '' OR pdt.product.name LIKE %:productName%) " +
            "AND (:code IS NULL OR :code = '' OR pdt.code LIKE %:code%) " +
            "AND (:colorName IS NULL OR :colorName = '' OR pdt.color.name LIKE %:colorName%) " +
            "AND (:sizeName IS NULL OR :sizeName = '' OR pdt.size.name LIKE %:sizeName%) " +
            "AND (:minPrice IS NULL OR pdt.defaultPrice >= :minPrice) " +
            "AND (:maxPrice IS NULL OR pdt.defaultPrice <= :maxPrice) " +
            "AND (:status IS NULL OR " +
            "    ((CASE WHEN p.status = 0 OR cl.status = 0 OR s.status = 0 OR sl.status = 0 OR col.status = 0 OR b.status = 0 THEN 2 " +
            "            ELSE (p.status * cl.status * s.status * sl.status * col.status * b.status) END) = :status))")

    Page<ProductDetail> pageAndFilterProductDetail(@Param("productName") String productName,
                                                   @Param("code") String code,
                                                   @Param("colorName") String colorName,
                                                   @Param("sizeName") String sizeName,
                                                   @Param("minPrice") Double minPrice,
                                                   @Param("maxPrice") Double maxPrice,
                                                   @Param("status") Integer status,
                                                   Pageable pageable);
}
