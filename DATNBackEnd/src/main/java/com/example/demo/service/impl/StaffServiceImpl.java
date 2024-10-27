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
import org.springframework.data.jpa.domain.Specification;

import java.util.List;
import java.util.Optional;
import java.util.function.Predicate;

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
    public Staff getById(int id) {
        return staffRepo.findById(id).get();
    }

    @Override
    public String softDelete(Integer id) throws Exception {
        Staff staff = staffRepo.findById(id).get();
        staff.setStatus(0);
        staffRepo.save(staff);
        return "Soft delete successfully";
    }

    @Override
    public String updateStatus(Integer id) {
        Staff existingStaff = staffRepo.findById(id).get();
        existingStaff.setStatus(1);
        staffRepo.save(existingStaff);
        return "Update status successfully";
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

    @Override
    public Page<Staff> searchByUsernameAndPhoneNumber(String username, String phoneNumber, Pageable pageable) {
        return staffRepo.findByUsernameAndPhoneNumber(username, phoneNumber, pageable);
    }
}
