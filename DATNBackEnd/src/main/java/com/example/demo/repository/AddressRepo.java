package com.example.demo.repository;

import com.example.demo.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AddressRepo extends JpaRepository<Address, Integer> {
    List<Address> findByCustomerId(int customerId);
    @Query("SELECT COUNT(a) FROM Address a WHERE a.customer.id = :customerId")
    Integer countByCustomerId(@Param("customerId") Integer customerId);
}
