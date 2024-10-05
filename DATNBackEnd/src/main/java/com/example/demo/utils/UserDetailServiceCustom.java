package com.example.demo.utils;

import com.example.demo.entity.Customer;
import com.example.demo.entity.Staff;
import com.example.demo.exception.UsernamePasswordNotValid;
import com.example.demo.repository.CustomerRepo;
import com.example.demo.repository.StaffRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserDetailServiceCustom implements UserDetailsService {
    @Autowired
    CustomerRepo customerRepo;
    @Autowired
    StaffRepo staffRepo;

    @Override
    public UserDetails loadUserByUsername(String username) {
        if (customerRepo.existsByUsername(username)) {
            Customer customer = customerRepo.findByUsername(username);
            User userAutho = new User(
                    customer.getUsername(),
                    customer.getPassword(),
                    Collections.singleton(new SimpleGrantedAuthority("ROLE_CUSTOMER"))
            );
            return userAutho;
        } else if (staffRepo.existsByUsername(username)) {
            Staff staff = staffRepo.findByUsername(username);

            // Lấy danh sách các GrantedAuthority từ danh sách permitions
            List<GrantedAuthority> authorities = staff.getPermission().stream()
                    .map(permition -> (GrantedAuthority) () -> permition.getName())
                    .collect(Collectors.toList());

            User userAutho = new User(
                    staff.getUsername(),
                    staff.getPassword(),
                    authorities
            );
            return userAutho;
        } else {
            throw new UsernamePasswordNotValid();
        }
    }
}
