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
        Set<Customer> customers = new HashSet<>();
        if (voucherDTO.getCustomers() != null && !voucherDTO.getCustomers().isEmpty()) {
            voucherDTO.getCustomers().forEach(customerId -> {
                Customer customer = customerRepository.findById(customerId).orElse(null);
                if (customer != null) {
                    customers.add(customer);
                }
            });
        }

        Voucher newVoucher = Voucher.builder()
                .code(voucherDTO.getCode())
                .quantity(voucherDTO.getQuantity())
                .discountAmount(voucherDTO.getDiscountAmount())
                .discountPercent(voucherDTO.getDiscountPercent())
                .expirationDate(voucherDTO.getExpirationDate())
                .minPurchaseAmount(voucherDTO.getMinPurchaseAmount())
                .maxDiscountAmount(voucherDTO.getMaxDiscountAmount())
                .termsAndConditions(voucherDTO.getTermsAndConditions())
                .status(voucherDTO.getStatus())
                .customers(customers) // Gán danh sách khách hàng
                .build();

        Voucher savedVoucher = voucherRepository.save(newVoucher);
        return VoucherResponse.fromVoucher(savedVoucher); // Sửa tên phương thức từ `fromVoucherResponse`
    }

    @Override
    public VoucherResponse update(Integer id, VoucherDTO voucherDTO) throws Exception {
        Voucher existingVoucher = getById(id); // Kiểm tra nếu voucher tồn tại
        Set<Customer> customers = new HashSet<>();

        // Cập nhật thông tin voucher
        existingVoucher.setCode(voucherDTO.getCode());
        existingVoucher.setQuantity(voucherDTO.getQuantity());
        existingVoucher.setDiscountAmount(voucherDTO.getDiscountAmount());
        existingVoucher.setDiscountPercent(voucherDTO.getDiscountPercent());
        existingVoucher.setExpirationDate(voucherDTO.getExpirationDate());
        existingVoucher.setMinPurchaseAmount(voucherDTO.getMinPurchaseAmount());
        existingVoucher.setMaxDiscountAmount(voucherDTO.getMaxDiscountAmount());
        existingVoucher.setTermsAndConditions(voucherDTO.getTermsAndConditions());
        existingVoucher.setStatus(voucherDTO.getStatus());

        // Cập nhật danh sách khách hàng
        if (voucherDTO.getCustomers() != null) {
            for (Integer customerId : voucherDTO.getCustomers()) {
                Customer customer = customerRepository.findById(customerId).orElse(null);
                if (customer != null) {
                    customers.add(customer);
                }
            }
        }
        existingVoucher.setCustomers(customers); // Thiết lập lại danh sách khách hàng

        Voucher updatedVoucher = voucherRepository.save(existingVoucher);
        return VoucherResponse.fromVoucher(updatedVoucher);
    }

    @Override
    public VoucherResponse updateCustomer(Integer id, Integer customerId) throws Exception {
        Customer existingCustomer = customerRepository.findById(customerId).orElse(null);
        Voucher existingVoucher = getById(id); // Kiểm tra nếu voucher tồn tại

        // Thiết lập khách hàng nếu tồn tại
        if (existingCustomer != null) {
            Set<Customer> customers = existingVoucher.getCustomers();
            customers.add(existingCustomer); // Thêm khách hàng vào danh sách
            existingVoucher.setCustomers(customers);
        } else {
            throw new Exception("Customer not found with id: " + customerId);
        }

        Voucher updatedVoucher = voucherRepository.save(existingVoucher);
        return VoucherResponse.fromVoucher(updatedVoucher);
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
