package com.example.demo.service;

import com.example.demo.dto.AddressDTO;
import com.example.demo.entity.Address;

import java.util.List;

public interface AddressService {
    List<Address> getAddressList(int customerId);

    Address add(AddressDTO addressDTO);

    Address update(Integer id, AddressDTO addressDTO) throws Exception;

    void deleteAddress(Integer id) throws Exception;
}
