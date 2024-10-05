package com.example.demo.service;

import com.example.demo.dto.StaffDTO;
import com.example.demo.entity.Permission;
import com.example.demo.entity.Staff;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface StaffService {
    Page<Staff> getAll(Pageable pageable);

    Staff save(Staff Staff);

    void deleteById(int id);

    Staff getById(int id);

    Staff savePermission(int id , List<Permission> permissions);

}
