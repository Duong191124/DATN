package com.example.demo.repository;

import com.example.demo.entity.PasswordResetRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PasswordResetRequestRepo extends JpaRepository<PasswordResetRequest, Integer> {
}
