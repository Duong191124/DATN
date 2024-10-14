package com.example.demo.service.impl;

import com.example.demo.dto.StaffDTO;
import com.example.demo.dto.UserPermissionDTO;
import com.example.demo.entity.Customer;
import com.example.demo.entity.Permission;
import com.example.demo.entity.Staff;
import com.example.demo.exception.UsernameExisting;
import com.example.demo.repository.PermissionRepo;
import com.example.demo.repository.StaffRepo;
import com.example.demo.service.StaffService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class StaffServiceImpl implements StaffService {

    private final StaffRepo staffRepo;
    private final PermissionRepo permissionRepo;

    @Override
    public Page<Staff> getAll(Pageable pageable) {
        return staffRepo.findAll(pageable);
    }

    @Override
    public Staff save(StaffDTO staff) {
        if(staffRepo.existsByUsername(staff.getUsername())){
            throw new UsernameExisting();
        }
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        Staff newStaff = Staff
                .builder()
                .username(staff.getUsername())
                .password(passwordEncoder.encode(staff.getPassword()))
                .email(staff.getEmail())
                .address(staff.getAddress())
                .phoneNumber(staff.getPhoneNumber())
                .dateOfBirth(staff.getDateOfBirth())
                .name(staff.getName())
                .notes(staff.getNotes())
                .gender(staff.getGender())
                .status(1)
                .build();
        return staffRepo.save(newStaff);
    }

    @Override
    public void deleteById(int id) {
        staffRepo.deleteById(id);
    }

    @Override
    public Staff getById(int id) {
        return staffRepo.findById(id).get();
    }

    @Override
    public Staff updatePermissions(Integer staffId, UserPermissionDTO permissionDTO) {
        Optional<Staff> staffOpt = staffRepo.findById(staffId);

        if (!staffOpt.isPresent()) {
            throw new RuntimeException("Staff not found with ID: " + staffId);
        }

        Staff staff = staffOpt.get();
        List<Permission> currentPermission = staff.getPermission();

        // Add permissions
        if (permissionDTO.getPermissionToAdd() != null) {
            List<Permission> permissionsToAdd = permissionRepo.findAllById(permissionDTO.getPermissionToAdd());
            for (Permission permission : permissionsToAdd) {
                if (!currentPermission.contains(permission)) {
                    currentPermission.add(permission);  // Add if it doesn't already exist
                }
            }
        }

        // Remove permissions
        if (permissionDTO.getPermissionToRemove() != null) {
            List<Permission> permissionsToRemove = permissionRepo.findAllById(permissionDTO.getPermissionToRemove());
            for (Permission permission : permissionsToRemove) {
                currentPermission.remove(permission);  // Remove if it exists
            }
        }

        staff.setPermission(currentPermission);
        return staffRepo.save(staff);
    }

}
