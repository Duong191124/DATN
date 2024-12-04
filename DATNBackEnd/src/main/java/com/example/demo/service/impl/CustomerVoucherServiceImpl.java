package com.example.demo.service.impl;

import com.example.demo.entity.Customer;
import com.example.demo.repository.CustomerRepo;
import com.example.demo.response.VoucherResponse;
import com.example.demo.service.CustomerVoucherService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomerVoucherServiceImpl implements CustomerVoucherService {
    private final CustomerRepo customerRepo;
    @Override
    public Set<VoucherResponse> findVouchersByCustomerId(Integer customerId) {
//        if (customerId == null) {
//            customerId = 1;
//        }
//        Customer customer = customerRepo.findById(customerId).orElseThrow(()-> new RuntimeException("not found voucher with customerId"));
//        return customer.getVouchers().stream().map(VoucherResponse::fromVoucher).collect(Collectors.toSet());
        return null;
    }
}
