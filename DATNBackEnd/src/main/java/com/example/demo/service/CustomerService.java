package com.example.demo.service;

import com.example.demo.dto.CustomerDTO;
import com.example.demo.entity.Customer;
import com.example.demo.repository.CustomerRepo;
import com.example.demo.service.impl.CustomerServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
@RequiredArgsConstructor
@Service
public class CustomerService implements CustomerServiceImpl {
    private final CustomerRepo customerRepo;
    @Override
    public List<Customer> getALl() {
        return customerRepo.findAll();
    }

    @Override
    public Customer add(CustomerDTO customer) {
        Customer newCustomer = Customer.builder()
                .name(customer.getName())
                .address(customer.getAddress())
                .email(customer.getEmail())
                .gender(customer.getGender())
                .phoneNumber(customer.getPhoneNumber())
                .vouchers(customer.getVouchers())
                .build();
        return  customerRepo.save(newCustomer);
    }

    @Override
    public Customer update(Integer id, CustomerDTO customerDTO) throws Exception {
        Customer existingCustomer = getCustomerByID(id);
        existingCustomer.setAddress(customerDTO.getAddress());
        existingCustomer.setEmail(customerDTO.getEmail());
        existingCustomer.setGender(customerDTO.getGender());
        existingCustomer.setPhoneNumber(customerDTO.getPhoneNumber());
        existingCustomer.setVouchers(customerDTO.getVouchers());
        existingCustomer.setName(customerDTO.getName());
        return customerRepo.save(existingCustomer);
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
