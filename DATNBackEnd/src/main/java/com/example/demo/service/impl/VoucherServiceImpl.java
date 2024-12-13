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

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RequiredArgsConstructor
@Service
public class VoucherServiceImpl implements VoucherService {

    private final VoucherRepo voucherRepository;

    public List<Voucher> getAllVouchers() {
        LocalDateTime currentDate = LocalDateTime.now();
        List<Voucher> vouchers = voucherRepository.findAll();

        // Cập nhật trạng thái tự động
        for (Voucher voucher : vouchers) {
            if (voucher.getExpirationDate().isBefore(currentDate) && voucher.getStatus() != 0) {
                voucher.setStatus(0); // Đặt trạng thái hết hạn
                voucherRepository.save(voucher); // Lưu lại thay đổi
            }
        }

        return vouchers;
    }

    // Lấy tất cả voucher không cần cập nhật trạng thái
    public List<Voucher> getAll() {
        return voucherRepository.findAll();
    }

    @Override
    public VoucherResponse add(VoucherDTO voucherDTO) {

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

        Voucher savedVoucher = voucherRepository.save(newVoucher);
        return VoucherResponse.fromVoucher(savedVoucher); // Sửa tên phương thức từ `fromVoucherResponse`
    }

    public VoucherResponse update(Integer id, VoucherDTO voucherDTO) throws Exception {
        Voucher existingVoucher = getById(id); // Kiểm tra nếu voucher tồn tại

        // Kiểm tra và chuyển đổi thời gian sang UTC (nếu cần)
        if (voucherDTO.getExpirationDate() != null) {
            // Đảm bảo chuyển đổi thời gian của ngày hết hạn sang UTC
            voucherDTO.setExpirationDate(voucherDTO.getExpirationDate()
                    .atZone(ZoneId.systemDefault()) // Chuyển sang múi giờ hệ thống (hoặc một múi giờ cố định)
                    .withZoneSameInstant(ZoneId.of("UTC")) // Chuyển sang UTC
                    .toLocalDateTime());
        }

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

        Voucher updatedVoucher = voucherRepository.save(existingVoucher);
        return VoucherResponse.fromVoucher(updatedVoucher);
    }


    @Override
    public VoucherResponse changeStatus(Integer id) throws Exception {
        Voucher existingVoucher = getById(id); // Kiểm tra nếu voucher tồn tại

        // Đổi trạng thái từ 1 sang 0 và ngược lại
        int newStatus = existingVoucher.getStatus() == 1 ? 0 : 1;
        existingVoucher.setStatus(newStatus);


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
