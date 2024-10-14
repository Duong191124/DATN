package com.example.demo.utils;

import com.example.demo.repository.CustomerRepo;
import com.example.demo.repository.StaffRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

@Service
public class UserDetailServiceCustom implements UserDetailsService {
    @Autowired
    CustomerRepo customerRepo;
    @Autowired
    StaffRepo staffRepo;

    @Override
    public UserDetails loadUserByUsername(String username) {
//        if (customerRepo.existsByUsername(username)) {
//            Customer customer = customerRepo.findByUsername(username);
//            User userAutho = new User(
//                    customer.getUsername(),
//                    customer.getPassword(),
//                    Collections.singleton(new SimpleGrantedAuthority("ROLE_" + customer.getPermission().getName().toUpperCase()))
//            );
//            return userAutho;
//        } else if (staffRepo.existsByUsername(username)) {
//            Staff staff = staffRepo.findByUsername(username);
//            User userAutho = new User(
//                    staff.getUsername(),
//                    staff.getPassword(),
//                    Collections.singleton(new SimpleGrantedAuthority("ROLE_" + staff.getPermission().getName().toUpperCase()))
//            );
//            return userAutho;
//        } else {
//            throw new UsernamePasswordNotValid();
//        }
        return null;
    }
}
