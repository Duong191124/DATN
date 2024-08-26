package com.example.demo.service;

import com.example.demo.dto.AccountDTO;
import com.example.demo.entity.Account;
import com.example.demo.entity.Role;
import com.example.demo.repository.AccountsRepo;
import com.example.demo.service.impl.AccountServiceIplm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AccountService implements AccountServiceIplm {
    @Autowired
    AccountsRepo accountsRepo;


    @Override
    public Page<Account> getAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);

        return accountsRepo.findAll(pageable);
    }

    @Override
    public Account save(AccountDTO accountDTO) {
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        return accountsRepo.save(
                Account
                        .builder()
                        .username(accountDTO.getUsername())
                        .password(passwordEncoder.encode(accountDTO.getPassword()))
                        .email(accountDTO.getEmail())
                        .address(accountDTO.getAddress())
                        .phoneNumber(accountDTO.getPhoneNumber())
                        .dateOfBirth(accountDTO.getDateOfBirth())
                        .name(accountDTO.getName())
                        .notes(accountDTO.getNotes())
                        .gender(accountDTO.getGender())
                        .status(1)
                        .role(Role.builder().id(1).build())
                        .build());
    }

    @Override
    public void deleteById(int id) {
        accountsRepo.deleteById(id);
    }

    @Override
    public Account getById(int id) {
        return accountsRepo.findById(id).get();
    }
}

