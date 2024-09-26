package com.example.demo.service.impl;

import com.example.demo.dto.CustomerDTO;
import com.example.demo.entity.Customer;
import com.example.demo.entity.Role;
import com.example.demo.entity.Voucher;
import com.example.demo.exception.UsernameExisting;
import com.example.demo.repository.CustomerRepo;
import com.example.demo.repository.StaffRepo;
import com.example.demo.repository.VoucherRepo;
import com.example.demo.response.CustomerResponse;
import com.example.demo.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RequiredArgsConstructor
@Service
public class CustomerServiceImpl implements CustomerService {
    private final VoucherRepo voucherRepo;
    private final CustomerRepo customerRepo;
    private final StaffRepo staffRepo;
    @Override
    public List<Customer> getALl() {
        return customerRepo.findAll();
    }

    @Override
    public CustomerResponse add(CustomerDTO customer) {
        if(customerRepo.existsByUsername(customer.getUsername()) || staffRepo.existsByUsername(customer.getUsername())){
            throw new UsernameExisting();
        }
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        Customer newCustomer = Customer
                .builder()
                .username(customer.getUsername())
                .password(passwordEncoder.encode(customer.getPassword()))
                .email(customer.getEmail())
                .address(customer.getAddress())
                .phoneNumber(customer.getPhoneNumber())
                .dateOfBirth(customer.getDateOfBirth())
                .name(customer.getName())
                .notes(customer.getNotes())
                .gender(customer.getGender())
                .status(1)
                .role(Role.builder().id(2).build())
                .build();
        Customer addCustomer = customerRepo.save(newCustomer);
        return CustomerResponse.fromCustomerResponse(addCustomer);
    }

    @Override
    public CustomerResponse update(Integer id, CustomerDTO customerDTO) throws Exception {
        Voucher existingVoucher = voucherRepo.findById(customerDTO.getVouchers()).orElse(null);
        Customer existingCustomer = getCustomerByID(id);
        existingCustomer.setDateOfBirth(customerDTO.getDateOfBirth());
        existingCustomer.setAddress(customerDTO.getAddress());
        existingCustomer.setEmail(customerDTO.getEmail());
        existingCustomer.setGender(customerDTO.getGender());
        existingCustomer.setPhoneNumber(customerDTO.getPhoneNumber());
        existingCustomer.setName(customerDTO.getName());
        existingCustomer.setNotes(customerDTO.getNotes());
        Set<Voucher> vouchers = new HashSet<>();
        vouchers.add(existingVoucher);
        existingCustomer.setVouchers(vouchers);
        Customer updateCustomer = customerRepo.save(existingCustomer);
        return CustomerResponse.fromCustomerResponse(updateCustomer);
    }

    @Override
    public void delete(Integer id) throws Exception {
        Customer existingCustomer = getCustomerByID(id);
        customerRepo.delete(existingCustomer);
    }

    @Override
    public Customer getCustomerByID(Integer id) throws Exception {
        return customerRepo.findById(id).orElseThrow(() -> new Exception("ID customer is not found"));
    }
}
