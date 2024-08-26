package com.example.demo.controller;

import com.example.demo.dto.VoucherDTO;
import com.example.demo.entity.Voucher;
import com.example.demo.service.VoucherService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("voucher")
public class VoucherController {
    @Autowired
    private VoucherService voucherService;

    @GetMapping("hien-thi")
    public ResponseEntity<List<Voucher>> getAllVouchers() {
        List<Voucher> vouchers = voucherService.getAll();
        return new ResponseEntity<>(vouchers, HttpStatus.OK);
    }

    @PostMapping("add")
    public ResponseEntity<Voucher> createVoucher(@Valid @RequestBody VoucherDTO voucherDTO) {
        Voucher voucher = Voucher.builder()
                .code(voucherDTO.getCode())
                .discountAmount(voucherDTO.getDiscountAmount())
                .discountPercent(voucherDTO.getDiscountPercent())
                .expirationDate(voucherDTO.getExpirationDate())
                .minPurchaseAmount(voucherDTO.getMinPurchaseAmount())
                .maxDiscountAmount(voucherDTO.getMaxDiscountAmount())
                .termsAndConditions(voucherDTO.getTermsAndConditions())
                .status(voucherDTO.getStatus())
                .build();

        Voucher createdVoucher = voucherService.add(voucher);
        return new ResponseEntity<>(createdVoucher, HttpStatus.CREATED);
    }

    @PutMapping("update/{id}")
    public ResponseEntity<Voucher> updateVoucher(@PathVariable("id") Integer id,
                                                 @Valid @RequestBody VoucherDTO voucherDTO) {
        try {
            Voucher updatedVoucher = voucherService.update(id, voucherDTO);
            return new ResponseEntity<>(updatedVoucher, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("detail/{id}")
    public ResponseEntity<Voucher> getVoucherById(@PathVariable("id") Integer id) {
        try {
            Voucher voucher = voucherService.getById(id);
            return new ResponseEntity<>(voucher, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("delete/{id}")
    public ResponseEntity<Void> deleteVoucher(@PathVariable("id") Integer id) {
        try {
            voucherService.delete(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
