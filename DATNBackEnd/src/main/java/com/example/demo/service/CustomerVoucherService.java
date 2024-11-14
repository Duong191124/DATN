package com.example.demo.service;

import com.example.demo.response.VoucherResponse;

import java.util.Set;

public interface CustomerVoucherService {
    Set<VoucherResponse> findVouchersByCustomerId(Integer customerId);
}
