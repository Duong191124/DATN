package com.example.demo.service.impl;

import com.example.demo.dto.StaffDTO;
import com.example.demo.entity.Role;
import com.example.demo.entity.Staff;
import com.example.demo.repository.StaffRepo;
import com.example.demo.service.StaffService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StaffServiceImpl implements StaffService {

    private final StaffRepo staffRepo;

    @Override
    public List<Staff> getAll() {
        return staffRepo.findAll();
    }

    @Override
    public Staff save(StaffDTO staffDTO) {
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        return staffRepo.save(
                Staff
                        .builder()
                        .username(staffDTO.getUsername())
                        .password(passwordEncoder.encode(staffDTO.getPassword()))
                        .email(staffDTO.getEmail())
                        .address(staffDTO.getAddress())
                        .phoneNumber(staffDTO.getPhoneNumber())
                        .dateOfBirth(staffDTO.getDateOfBirth())
                        .name(staffDTO.getName())
                        .notes(staffDTO.getNotes())
                        .gender(staffDTO.getGender())
                        .status(1)
                        .role(Role.builder().id(2).build())
                        .build());
    }

    @Override
    public void deleteById(int id) {
        staffRepo.deleteById(id);
    }

    @Override
    public Staff getById(int id) {
        return staffRepo.findById(id).get();
    }
}
