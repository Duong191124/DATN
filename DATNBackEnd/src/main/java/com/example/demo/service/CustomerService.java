package com.example.demo.service;

import com.example.demo.dto.CustomerDTO;
import com.example.demo.entity.Customer;
import com.example.demo.response.CustomerResponse;

import java.util.List;

public interface CustomerService {
    List<Customer> getALl();

    CustomerResponse add(CustomerDTO customer);

    CustomerResponse update(Integer id, CustomerDTO customerDTO) throws Exception;

    void delete(Integer id) throws Exception;

    Customer getCustomerByID(Integer id) throws Exception;
}
