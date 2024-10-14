package com.example.demo.service.impl;

import com.example.demo.entity.Permission;
import com.example.demo.repository.PermissionRepo;
import com.example.demo.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class RoleServiceImpl implements RoleService {
    @Autowired
    PermissionRepo permissionRepol;
    public List<Permission> getAll() {
        return permissionRepol.findAll();
    }

    @Override
    public Permission getById(int id) {
        return permissionRepol.findById(id).get();
    }

    @Override
    public Permission save(Permission permission) {
        permission.setStatus(1);
        return permissionRepol.save(permission);
    }

    @Override
    public void deleteById(int id) {
        permissionRepol.deleteById(id);
    }
}
