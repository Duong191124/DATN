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
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RequiredArgsConstructor
@Service
public class VoucherServiceImpl implements VoucherService {

    private final VoucherRepo voucherRepository;
    private final CustomerRepo customerRepository;

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
                .status(1)
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
    public VoucherResponse updateCustomer(Integer id, List<Integer> customerIds) throws Exception {
        Voucher existingVoucher = getById(id); // Kiểm tra nếu voucher tồn tại
        Set<Customer> customers = new HashSet<>();  
        if (customerIds != null && !customerIds.isEmpty()) {
            // Duyệt qua danh sách customerIds để thêm từng khách hàng
            for (Integer customerId : customerIds) {
                Customer existingCustomer = customerRepository.findById(customerId).orElse(null);
                if (existingCustomer != null) {
                    customers.add(existingCustomer); // Thêm khách hàng vào danh sách
                } else {
                    throw new Exception("Customer not found with id: " + customerId);
                }
            }
        }
        // Nếu customerIds là null hoặc rỗng, xóa tất cả khách hàng liên kết với voucher
        if (customerIds == null || customerIds.isEmpty()) {
            existingVoucher.setCustomers(new HashSet<>()); // Đặt danh sách khách hàng thành rỗng
        } else {
            // Cập nhật danh sách khách hàng của voucher
            existingVoucher.setCustomers(customers);
        }
        Voucher updatedVoucher = voucherRepository.save(existingVoucher);
        return VoucherResponse.fromVoucher(updatedVoucher);
    }

    @Override
    public VoucherResponse changeStatus(Integer id) throws Exception {
        Voucher existingVoucher = getById(id); // Kiểm tra nếu voucher tồn tại

        // Đổi trạng thái từ 1 sang 0 và ngược lại
        int newStatus = existingVoucher.getStatus() == 1 ? 0 : 1;
        existingVoucher.setStatus(newStatus);

        // Nếu trạng thái là "hết hạn" (giả sử 0 là "hết hạn")
        if (newStatus == 0) {
            // Hủy áp dụng voucher: gỡ danh sách khách hàng liên kết
            existingVoucher.setCustomers(new HashSet<>()); // Đặt danh sách khách hàng thành rỗng
        }

        // Lưu lại voucher đã cập nhật
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
