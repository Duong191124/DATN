package com.example.demo.response;

import com.example.demo.entity.Customer;
import com.example.demo.entity.Voucher;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Date;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CustomerResponse {
    private int id;

    private String username;

    private String email;

    private String address;

    private String phoneNumber;

    private int status;

    private LocalDateTime dateOfBirth;

    private String name;

    private String notes;

    private int gender;

    private Integer vouchers;

    public static CustomerResponse fromCustomerResponse(Customer customer){
        return CustomerResponse
                .builder()
                .id(customer.getId())
                .username(customer.getUsername())
                .name(customer.getName())
                .phoneNumber(customer.getPhoneNumber())
                .gender(customer.getGender())
                .email(customer.getEmail())
                .address(customer.getAddress())
                .status(customer.getStatus())
                .dateOfBirth(customer.getDateOfBirth())
                .notes(customer.getNotes())
                .build();
    }
}
