package com.example.demo.service.impl;

import com.example.demo.dto.AddressDTO;
import com.example.demo.entity.Address;
import com.example.demo.entity.Brand;
import com.example.demo.entity.Customer;
import com.example.demo.repository.AddressRepo;
import com.example.demo.repository.CustomerRepo;
import com.example.demo.service.AddressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AddressServiceImpl implements AddressService {

    @Autowired
    private AddressRepo addressRepo;

    @Autowired
    private CustomerRepo customerRepo;

    @Override
    public List<Address> getAddressList() {
        return addressRepo.findAll();
    }

    @Override
    public Address add(AddressDTO addressDTO) {
        Customer customer = customerRepo.findById(addressDTO.getCustomerId()).get();
        Address newAddress = Address.builder()
                .city(addressDTO.getCity())
                .district(addressDTO.getDistrict())
                .ward(addressDTO.getWard())
                .customer(customer)
                .build();
        return addressRepo.save(newAddress);
    }

    @Override
    public Address update(Integer id, AddressDTO addressDTO) throws Exception {
        Address existingAddress = addressRepo.findById(id).get();
        existingAddress.setCity(addressDTO.getCity());
        existingAddress.setWard(addressDTO.getWard());
        existingAddress.setDistrict(addressDTO.getDistrict());
        return addressRepo.save(existingAddress);
    }

    @Override
    public void deleteAddress(Integer id) throws Exception {
        addressRepo.deleteById(id);
    }
}
