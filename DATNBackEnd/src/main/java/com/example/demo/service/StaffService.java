package com.example.demo.service;

import com.example.demo.dto.StaffDTO;
import com.example.demo.entity.Staff;

import java.util.List;

public interface StaffService {
    List<Staff> getAll();

    Staff save(StaffDTO staffDTO);

    void deleteById(int id);

    Staff getById(int id);

}
