package com.example.demo.repository;

import com.example.demo.entity.Permission;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PermissionRepo extends JpaRepository<Permission, Integer> {
    Page<Permission> findByNameContainingIgnoreCase(String name, Pageable pageable);
}
