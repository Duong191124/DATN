package com.example.demo.service;

import com.cloudinary.api.exceptions.NotFound;
import com.example.demo.entity.Permission;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface PermissionService {
    Page<Permission> getAll(Pageable pageable);
    Permission getById(int id) throws NotFound;

    void deleteById(int id);
    Permission save(Permission permission);
}
