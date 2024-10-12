package com.example.demo.service;

import com.example.demo.dto.CustomerDTO;
import com.example.demo.entity.Customer;
import com.example.demo.response.CustomerResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface CustomerService {
    Page<Customer> getALl(Pageable pageable);

    CustomerResponse add(CustomerDTO customer);

    CustomerResponse update(Integer id, CustomerDTO customerDTO) throws Exception;

    void delete(Integer id) throws Exception;

    Customer getCustomerByID(Integer id) throws Exception;
}
