package com.example.demo.controller;

import com.example.demo.response.MessageReponse;
import com.example.demo.response.VoucherResponse;
import com.example.demo.service.CustomerVoucherService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.Set;

@Controller
@RequiredArgsConstructor
@RequestMapping("api/v1/customer-voucher")
public class CustomerVoucherController {
    private final CustomerVoucherService customerVoucherService;
    @GetMapping("{customerId}")
    public ResponseEntity<?> getAllVoucherFindCustomerId(@PathVariable(name = "customerId") Integer customerId){
        Set<VoucherResponse> voucherResponseSet = customerVoucherService.findVouchersByCustomerId(customerId);
        return ResponseEntity.ok(new MessageReponse("successfully",200,voucherResponseSet));
    }
}
