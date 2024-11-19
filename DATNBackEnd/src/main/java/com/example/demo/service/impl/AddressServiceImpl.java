package com.example.demo.service.impl;

import com.example.demo.dto.AddressDTO;
import com.example.demo.dto.AddressUpdateDTO;
import com.example.demo.entity.Address;
import com.example.demo.entity.Brand;
import com.example.demo.entity.Customer;
import com.example.demo.repository.AddressRepo;
import com.example.demo.repository.CustomerRepo;
import com.example.demo.response.AddressResponse;
import com.example.demo.service.AddressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AddressServiceImpl implements AddressService {

    @Autowired
    private AddressRepo addressRepo;

    @Autowired
    private CustomerRepo customerRepo;

    @Override
    public List<Address> getAddressList(int customerId) {
        List<Address> addresses = addressRepo.findByCustomerId(customerId);

        // Ánh xạ sang AddressResponseDTO
            return addresses.stream()
                    .map(address -> Address.builder()
                            .id(address.getId())
                            .name(address.getName())
                            .phoneNumber(address.getPhoneNumber())
                            .city(address.getCity())
                            .district(address.getDistrict())
                            .fromDistrict(3440) // Giá trị mặc định
                            .ward(address.getWard())
                            .serviceId(53321) // Giá trị mặc định
                            .addressDetail(address.getAddressDetail())
                            .customer(address.getCustomer())
                            .build())
                    .collect(Collectors.toList());

    }

    @Override
    public Address add(AddressDTO addressDTO) {
        boolean addressExists = addressRepo.existsByCustomerId(addressDTO.getCustomerId());
        if (addressExists) {
            throw new IllegalArgumentException("Customer already has an address.");
        }
        Customer customer = customerRepo.findById(addressDTO.getCustomerId())
                .orElseThrow(() -> new IllegalArgumentException("Customer not found with ID: " + addressDTO.getCustomerId()));
        Address newAddress = Address.builder()
                .name(addressDTO.getName())
                .phoneNumber(addressDTO.getPhoneNumber())
                .city(addressDTO.getCity())
                .district(addressDTO.getDistrict())
                .fromDistrict(3440)
                .ward(addressDTO.getWard())
                .serviceId(53321)
                .customer(customer)
                .addressDetail(addressDTO.getAddressDetail())
                .build();
        return addressRepo.save(newAddress);
    }

    @Override
    public Address update(Integer id, AddressUpdateDTO addressUpdateDTO) throws Exception {
        Address existingAddress = addressRepo.findById(id).get();
        existingAddress.setName(addressUpdateDTO.getName());
        existingAddress.setPhoneNumber(addressUpdateDTO.getPhoneNumber());
        existingAddress.setCity(addressUpdateDTO.getCity());
        existingAddress.setDistrict(addressUpdateDTO.getDistrict());
        existingAddress.setFromDistrict(3440);
        existingAddress.setWard(addressUpdateDTO.getWard());
        existingAddress.setServiceId(53321);
        existingAddress.setAddressDetail(addressUpdateDTO.getAddressDetail());
        return addressRepo.save(existingAddress);
    }

    @Override
    public void deleteAddress(Integer id) throws Exception {
        addressRepo.deleteById(id);
    }
}
