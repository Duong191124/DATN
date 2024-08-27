package com.example.demo.service;

import com.example.demo.dto.VoucherDTO;
import com.example.demo.entity.Customer;
import com.example.demo.entity.Voucher;
import com.example.demo.repository.CustomerRepo;
import com.example.demo.repository.VoucherRepo;
import com.example.demo.service.impl.VoucherServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@RequiredArgsConstructor
@Service
public class VoucherService implements VoucherServiceImpl {

    private final VoucherRepo voucherRepository;
    private final CustomerRepo customerRepository;


    @Override
    public List<Voucher> getAll() {
        return voucherRepository.findAll();
    }

    @Override
    public Voucher add(VoucherDTO voucherDTO) {
        Voucher newVoucher = Voucher.builder()
                .code(voucherDTO.getCode())
                .discountAmount(voucherDTO.getDiscountAmount())
                .discountPercent(voucherDTO.getDiscountPercent())
                .expirationDate(voucherDTO.getExpirationDate())
                .minPurchaseAmount(voucherDTO.getMinPurchaseAmount())
                .maxDiscountAmount(voucherDTO.getMaxDiscountAmount())
                .termsAndConditions(voucherDTO.getTermsAndConditions())
                .status(voucherDTO.getStatus())
                .build();

        // Liên kết với khách hàng
        Set<Customer> customers = new HashSet<>();
        if (voucherDTO.getCustomerIds() != null) {
            for (Integer customerId : voucherDTO.getCustomerIds()) {
                Optional<Customer> customerOpt = customerRepository.findById(customerId);
                customerOpt.ifPresent(customers::add);
            }
        }
        newVoucher.setCustomers(customers);

        return voucherRepository.save(newVoucher);
    }

    @Override
    public Voucher update(Integer id, VoucherDTO voucherDTO) throws Exception {
        // Tìm kiếm voucher dựa trên ID
        Voucher existingVoucher = voucherRepository.findById(id)
                .orElseThrow(() -> new Exception("Voucher not found with id: " + id));

        // Cập nhật thông tin từ DTO vào entity
        existingVoucher.setCode(voucherDTO.getCode());
        existingVoucher.setDiscountAmount(voucherDTO.getDiscountAmount());
        existingVoucher.setDiscountPercent(voucherDTO.getDiscountPercent());
        existingVoucher.setExpirationDate(voucherDTO.getExpirationDate());
        existingVoucher.setMinPurchaseAmount(voucherDTO.getMinPurchaseAmount());
        existingVoucher.setMaxDiscountAmount(voucherDTO.getMaxDiscountAmount());
        existingVoucher.setTermsAndConditions(voucherDTO.getTermsAndConditions());
        existingVoucher.setStatus(voucherDTO.getStatus());

        // Cập nhật danh sách khách hàng liên quan
        Set<Customer> customers = new HashSet<>();
        if (voucherDTO.getCustomerIds() != null) {
            for (Integer customerId : voucherDTO.getCustomerIds()) {
                Optional<Customer> customerOpt = customerRepository.findById(customerId);
                customerOpt.ifPresent(customers::add);
            }
        }
        existingVoucher.setCustomers(customers);

        // Lưu lại voucher đã cập nhật
        return voucherRepository.save(existingVoucher);
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
