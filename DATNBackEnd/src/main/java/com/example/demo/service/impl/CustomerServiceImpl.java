package com.example.demo.service.impl;

import com.example.demo.dto.CustomerDTO;
import com.example.demo.entity.Customer;
import com.example.demo.entity.Voucher;
import com.example.demo.exception.UsernameExisting;
import com.example.demo.repository.CustomerRepo;
import com.example.demo.repository.StaffRepo;
import com.example.demo.repository.VoucherRepo;
import com.example.demo.response.CustomerResponse;
import com.example.demo.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@RequiredArgsConstructor
@Service
public class CustomerServiceImpl implements CustomerService {
    private final VoucherRepo voucherRepo;
    private final CustomerRepo customerRepo;
    private final StaffRepo staffRepo;
    @Override
    public Page<Customer> getALl(Pageable pageable) {
        return customerRepo.findAll(pageable);
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
                .build();
        Customer addCustomer = customerRepo.save(newCustomer);
        return CustomerResponse.fromCustomerResponse(addCustomer);
    }

    @Override
    public CustomerResponse update(Integer id, CustomerDTO customerDTO) throws Exception {
        Customer existingCustomer = getCustomerByID(id);
        existingCustomer.setDateOfBirth(customerDTO.getDateOfBirth());
        existingCustomer.setAddress(customerDTO.getAddress());
        existingCustomer.setEmail(customerDTO.getEmail());
        existingCustomer.setGender(customerDTO.getGender());
        existingCustomer.setPhoneNumber(customerDTO.getPhoneNumber());
        existingCustomer.setName(customerDTO.getName());
        existingCustomer.setNotes(customerDTO.getNotes());
        Set<Voucher> vouchers = new HashSet<>();
        Customer updateCustomer = customerRepo.save(existingCustomer);
        return CustomerResponse.fromCustomerResponse(updateCustomer);
    }

    @Override
    public String softDelete(Integer id) throws Exception {
        Customer customer = customerRepo.findById(id).get();
        customer.setStatus(0);
        customerRepo.save(customer);
        return "Soft delete successfully";
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
