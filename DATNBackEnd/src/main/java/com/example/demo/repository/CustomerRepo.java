package com.example.demo.repository;

import com.example.demo.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CustomerRepo extends JpaRepository<Customer, Integer> {
    public boolean existsByUsername(String usename);
    public boolean existsByEmail(String email);

    public Customer findByUsername(String username);

    public Customer findByEmail(String email);
}
