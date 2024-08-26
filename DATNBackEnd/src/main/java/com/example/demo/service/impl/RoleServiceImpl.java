package com.example.demo.service.impl;

import com.example.demo.entity.Role;
import org.springframework.data.domain.Page;

import java.util.List;

public interface RoleServiceImpl {
    List<Role> getAll();

    Role getById(int id);

    Role save(Role role);

    void deleteById(int id);
}
