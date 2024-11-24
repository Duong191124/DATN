package com.example.demo.repository;

import com.example.demo.dto.TopSellingProductDTO;
import com.example.demo.entity.Product;
import com.example.demo.response.TopSellingProductsAttributesResponse;
import com.example.demo.response.TotalQuantityProductStatisticsResponse;
import com.example.demo.response.TotalQuantityProductsAttributeResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepo extends JpaRepository<Product, Integer> {
    @Query("SELECT p FROM Product p " +
            "JOIN p.category c " +
            "JOIN p.sleeve s " +
            "JOIN p.collar col " +
            "JOIN p.brand b " +
            "WHERE (:categoryId IS NULL OR :categoryId = 0 OR c.id = :categoryId) AND " +
            "(:sleeveId IS NULL OR :sleeveId = 0 OR s.id = :sleeveId) AND " +
            "(:collarId IS NULL OR :collarId = 0 OR col.id = :collarId) AND " +
            "(:brandId IS NULL OR :brandId = 0 OR b.id = :brandId) AND " +
            "(:productName IS NULL OR p.name LIKE CONCAT('%', :productName, '%')) AND " +
            "(:price IS NULL OR p.price = :price) AND " +
            "(:description IS NULL OR p.description LIKE CONCAT('%', :description, '%')) AND " +
            "(:status IS NULL OR (p.status * s.status*col.status*b.status) = :status)") // Thêm điều kiện lọc theo status
    Page<Product> pageAllProducts(@Param("categoryId") Integer categoryId,
                                  @Param("productName") String productName,
                                  @Param("sleeveId") Integer sleeveId,
                                  @Param("collarId") Integer collarId,
                                  @Param("brandId") Integer brandId,
                                  @Param("price") Double price,
                                  @Param("description") String description,
                                  @Param("status") Integer status, // Tham số status
                                  Pageable pageable);


    boolean existsByCode(String code);

    boolean existsByName(String name);

    List<Product> findByBrandId(Integer brandId);

    List<Product> findByCollarId(Integer collarId);

    List<Product> findBySleeveId(Integer sleeveId);

    List<Product> findByCategoryId(Integer categoryId);

    @Query("SELECT new com.example.demo.dto.TopSellingProductDTO(" +
            "p.code, " +
            "p.name, " +
            "SUM(od.quantity)) " +
            "FROM Product p " +
            "JOIN ProductDetail pd on pd.product.id = p.id " +
            "JOIN OrderDetail od on od.productDetail.id = pd.id " +
            "JOIN od.orders o " +
            "WHERE " +
            "(:day IS NULL OR FUNCTION('DAY', o.orderDate) = :day) " +
            "AND (:month IS NULL OR FUNCTION('MONTH', o.orderDate) = :month) " +
            "AND (:year IS NULL OR FUNCTION('YEAR', o.orderDate) = :year) " +
            "AND o.status = 'shipped' " +
            "GROUP BY p.code, p.name " +
            "ORDER BY SUM(od.quantity) DESC")
    List<TopSellingProductDTO> findTop10SellingProducts(
            @Param("day") Integer day,
            @Param("month") Integer month,
            @Param("year") Integer year
    );

    @Query("SELECT new com.example.demo.response.TopSellingProductsAttributesResponse(" +
            "p.code, " +
            "p.name, " +
            "pd.color.name, " +
            "pd.size.name, " +
            "SUM(od.quantity)) " +
            "FROM Product p " +
            "JOIN ProductDetail pd on pd.product.id = p.id " +
            "JOIN OrderDetail od on od.productDetail.id = pd.id " +
            "JOIN od.orders o " +
            "WHERE " +
            "(:day IS NULL OR FUNCTION('DAY', o.orderDate) = :day) " +
            "AND (:month IS NULL OR FUNCTION('MONTH', o.orderDate) = :month) " +
            "AND (:year IS NULL OR FUNCTION('YEAR', o.orderDate) = :year) " +
            "AND o.status = 'shipped' " +
            "GROUP BY p.code, p.name, pd.color, pd.size " +
            "ORDER BY SUM(od.quantity) DESC")
    List<TopSellingProductsAttributesResponse> findTopSellingProductsByAttributes(
            @Param("day") Integer day,
            @Param("month") Integer month,
            @Param("year") Integer year
    );

    @Query("SELECT new com.example.demo.response.TotalQuantityProductStatisticsResponse(p.name, SUM(pd.quantity)) " +
            "FROM Product p " +
            "LEFT JOIN ProductDetail pd ON p.id = pd.product.id " +
            "GROUP BY p.name " +
            "ORDER BY SUM(pd.quantity) DESC")
    List<TotalQuantityProductStatisticsResponse> findTotalQuantityByProductName();

    @Query("SELECT new com.example.demo.response.TotalQuantityProductsAttributeResponse(p.name, s.name, c.name, SUM(pd.quantity)) " +
            "FROM Product p " +
            "JOIN ProductDetail pd ON p.id = pd.product.id " +
            "JOIN Size s ON pd.size.id = s.id " +
            "JOIN Color c ON pd.color.id = c.id " +
            "GROUP BY p.name, s.name, c.name " +
            "ORDER BY p.name, s.name, c.name")
    List<TotalQuantityProductsAttributeResponse> findTotalQuantityByProductSizeColor();

}
