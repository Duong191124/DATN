package com.example.demo.service.impl;

import com.example.demo.dto.VoucherDTO;
import com.example.demo.entity.Customer;
import com.example.demo.entity.Voucher;
import com.example.demo.repository.CustomerRepo;
import com.example.demo.repository.VoucherRepo;
import com.example.demo.response.VoucherResponse;
import com.example.demo.service.VoucherService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RequiredArgsConstructor
@Service
public class VoucherServiceImpl implements VoucherService {

    private final VoucherRepo voucherRepository;
    private final CustomerRepo customerRepository;


    @Override
    public List<Voucher> getAll() {
        return voucherRepository.findAll();
    }

    @Override
    public VoucherResponse add(VoucherDTO voucherDTO) {
        Customer existingCustomer = customerRepository.findById(voucherDTO.getCustomers()).orElse(null);
        Voucher newVoucher = Voucher.builder()
                .code(voucherDTO.getCode())
                .quantity(voucherDTO.getQuantity())
                .discountAmount(voucherDTO.getDiscountAmount())
                .discountPercent(voucherDTO.getDiscountPercent())
                .expirationDate(voucherDTO.getExpirationDate())
                .minPurchaseAmount(voucherDTO.getMinPurchaseAmount())
                .maxDiscountAmount(voucherDTO.getMaxDiscountAmount())
                .termsAndConditions(voucherDTO.getTermsAndConditions())
                .status(1)

                .build();
        Voucher addVoucher = voucherRepository.save(newVoucher);
        return VoucherResponse.fromVoucherResponse(addVoucher);
    }

    @Override
    public VoucherResponse update(Integer id, VoucherDTO voucherDTO) throws Exception {
        Customer existingCustomer = customerRepository.findById(voucherDTO.getCustomers()).orElse(null);
        Voucher existingVoucher = getById(id); // Kiểm tra nếu voucher tồn tại

        existingVoucher.setCode(voucherDTO.getCode());
        existingVoucher.setQuantity((voucherDTO.getQuantity()));
        existingVoucher.setDiscountAmount(voucherDTO.getDiscountAmount());
        existingVoucher.setDiscountPercent(voucherDTO.getDiscountPercent());
        existingVoucher.setExpirationDate(voucherDTO.getExpirationDate());
        existingVoucher.setMinPurchaseAmount(voucherDTO.getMinPurchaseAmount());
        existingVoucher.setMaxDiscountAmount(voucherDTO.getMaxDiscountAmount());
        existingVoucher.setTermsAndConditions(voucherDTO.getTermsAndConditions());
        existingVoucher.setStatus(voucherDTO.getStatus());

        // Thiết lập khách hàng nếu tồn tại
        if (existingCustomer != null) {
            existingVoucher.setCustomer(existingCustomer);
        }

        Voucher updateVoucher = voucherRepository.save(existingVoucher);
        return VoucherResponse.fromVoucherResponse(updateVoucher);
    }
    @Override
    public VoucherResponse updateCustomer(Integer id, Integer customerId) throws Exception {
        Customer existingCustomer = customerRepository.findById(customerId).orElse(null);
        Voucher existingVoucher = getById(id); // Kiểm tra nếu voucher tồn tại

        // Thiết lập khách hàng nếu tồn tại
        if (existingCustomer != null) {
            existingVoucher.setCustomer(existingCustomer);
        } else {
            throw new Exception("Customer not found with id: " + customerId);
        }

        Voucher updatedVoucher = voucherRepository.save(existingVoucher);
        return VoucherResponse.fromVoucherResponse(updatedVoucher);
    }

    @Override
    public Voucher getById(Integer id) throws Exception {
        return voucherRepository.findById(id)
                .orElseThrow(() -> new Exception("Voucher not found with id: " + id));
    }

    @Override
    public void delete(Integer id) throws Exception {
        Voucher voucher = voucherRepository.findById(id)
                .orElseThrow(() -> new Exception("Voucher not found with id: " + id));
        voucherRepository.delete(voucher);
    }

}
