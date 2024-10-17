package com.example.demo.repository;

import com.example.demo.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

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
            "(:description IS NULL OR p.description LIKE CONCAT('%', :description, '%'))")
    Page<Product> pageAllProducts(@Param("categoryId") Integer categoryId,
                                  @Param("productName") String productName,
                                  @Param("sleeveId") Integer sleeveId,
                                  @Param("collarId") Integer collarId,
                                  @Param("brandId") Integer brandId,
                                  @Param("price") Double price,
                                  @Param("description") String description,
                                  Pageable pageable);

    boolean existsByCode(String code);
    boolean existsByName(String name);


    

}