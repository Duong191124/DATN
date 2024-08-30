package com.example.demo.service.impl;

import com.example.demo.entity.Role;
<<<<<<< HEAD
import com.example.demo.repository.RoleRepo;
import com.example.demo.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class RoleServiceImpl implements RoleService {
    @Autowired
    RoleRepo roleRepol;
    public List<Role> getAll() {
        return roleRepol.findAll();
    }

    @Override
    public Role getById(int id) {
        return roleRepol.findById(id).get();
    }

    @Override
    public Role save(Role role) {
        role.setStatus(1);
        return roleRepol.save(role);
    }

    @Override
    public void deleteById(int id) {
        roleRepol.deleteById(id);
    }
=======
import org.springframework.data.domain.Page;

import java.util.List;

public interface RoleServiceImpl {
    List<Role> getAll();

    Role getById(int id);

    Role save(Role role);

    void deleteById(int id);
>>>>>>> 20be25b1403d69c969009ba98fdc54c3d8736ec4
}
