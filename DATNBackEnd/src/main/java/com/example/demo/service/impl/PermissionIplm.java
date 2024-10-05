package com.example.demo.service.impl;

import com.cloudinary.api.exceptions.NotFound;
import com.example.demo.entity.Permission;
import com.example.demo.repository.PermissionRepo;
import com.example.demo.service.PermissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class PermissionIplm implements PermissionService {
    @Autowired
    PermissionRepo permissionRepo;
    @Override
    public Page<Permission> getAll(Pageable pageable) {
        try {
            return permissionRepo.findAll(pageable);
        }catch (Exception e){
            throw new RuntimeException();
        }
    }

    @Override
    public Permission getById(int id) throws NotFound {
        try {
            return permissionRepo.findById(id).get();
        }catch (Exception e){
            throw new NotFound("not found permission");
        }
    }

    @Override
    public void deleteById(int id) {
        try{
            permissionRepo.deleteById(id);
        }catch (Exception e){
            throw new RuntimeException();
        }
    }

    @Override
    public Permission save(Permission permission) {
        try {
            return permissionRepo.save(permission);
        }catch (Exception e){
            throw new RuntimeException();
        }
    }
}
