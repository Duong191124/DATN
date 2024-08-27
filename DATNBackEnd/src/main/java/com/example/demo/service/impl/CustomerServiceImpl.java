package com.example.demo.service.impl;

import com.example.demo.dto.CustomerDTO;
import com.example.demo.entity.Customer;

import java.util.List;

public interface CustomerServiceImpl {
    List<Customer> getALl();

    Customer add(CustomerDTO customer);

    Customer update(Integer id, CustomerDTO customerDTO) throws Exception;

    void delete(Integer id) throws Exception;


    Customer getCustomerByID(Integer id) throws Exception;
}
