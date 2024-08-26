package com.example.demo.service;

import com.example.demo.dto.VoucherDTO;
import com.example.demo.entity.Voucher;
import com.example.demo.repository.VoucherRepo;
import com.example.demo.service.impl.VoucherServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class VoucherService implements VoucherServiceImpl {

    private final VoucherRepo voucherRepository;

    @Override
    public List<Voucher> getAll() {
        return voucherRepository.findAll();
    }

    @Override
    public Voucher add(Voucher voucher) {
        return voucherRepository.save(voucher);
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
