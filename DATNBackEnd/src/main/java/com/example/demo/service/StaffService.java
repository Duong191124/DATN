package com.example.demo.service;

import com.example.demo.dto.StaffDTO;
import com.example.demo.dto.UserPermissionDTO;
import com.example.demo.entity.Permission;
import com.example.demo.entity.Staff;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface StaffService {
    Page<Staff> getAll(Pageable pageable);

    Staff save(StaffDTO Staff);

    Staff getById(int id);

    String softDelete(Integer id) throws Exception;

    String updateStatus(Integer id);

    Staff updatePermissions(Integer staffId, UserPermissionDTO permissionDTO);

}
