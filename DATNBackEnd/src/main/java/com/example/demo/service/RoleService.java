package com.example.demo.service;

import com.example.demo.entity.Permission;

import java.util.List;

public interface RoleService {
    List<Permission> getAll();

    Permission getById(int id);

    Permission save(Permission permission);

    void deleteById(int id);
}
