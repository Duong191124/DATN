package com.example.demo.controller;

import com.example.demo.dto.VoucherDTO;
import com.example.demo.entity.Voucher;
import com.example.demo.response.MessageReponse;
import com.example.demo.response.VoucherResponse;
import com.example.demo.service.impl.VoucherServiceImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("${api.prefix}/voucher")
public class VoucherController {
    @Autowired
    private VoucherServiceImpl voucherService;

    @PreAuthorize("hasAuthority('READ_VOUCHER')")
    @GetMapping("/getVoucher")
    public ResponseEntity<MessageReponse> getAllVouchers() {
        // Lấy danh sách voucher và tự động cập nhật trạng thái
        List<VoucherResponse> voucherList = voucherService.getAllVouchers()
                .stream()
                .map(VoucherResponse::fromVoucher) // Chuyển đổi sang DTO
                .toList();

        // Trả về phản hồi
        return ResponseEntity.ok().body(MessageReponse.builder()
                .message("Lấy thông tin thành công")
                .status(HttpStatus.OK.value())
                .data(voucherList)
                .build());
    }
    @PreAuthorize("hasAuthority('CREATE_VOUCHER')")
    @PostMapping("")
    public ResponseEntity<?> createVoucher(@Valid @RequestBody VoucherDTO voucherDTO, BindingResult result) {
        if (result.hasErrors()) {
            List<String> errorMessages = result.getFieldErrors().stream()
                    .map(FieldError::getDefaultMessage)
                    .collect(Collectors.toList());
            return ResponseEntity.badRequest().body(MessageReponse.builder()
                    .message(String.join(", ", errorMessages))
                    .status(HttpStatus.BAD_REQUEST.value())
                    .build());
        }

        VoucherResponse createdVoucher = voucherService.add(voucherDTO);
        return new ResponseEntity<>(createdVoucher, HttpStatus.CREATED);
    }
    @PreAuthorize("hasAuthority('UPDATE_VOUCHER')")
    @PutMapping("{id}")
    public ResponseEntity<?> updateVoucher(@PathVariable("id") Integer id,
                                           @Valid @RequestBody VoucherDTO voucherDTO,
                                           BindingResult result) {
        if (result.hasErrors()) {
            List<String> errorMessages = result.getFieldErrors().stream()
                    .map(FieldError::getDefaultMessage)
                    .collect(Collectors.toList());
            return ResponseEntity.badRequest().body(MessageReponse.builder()
                    .message(String.join(", ", errorMessages))
                    .status(HttpStatus.BAD_REQUEST.value())
                    .build());
        }

        try {
            VoucherResponse updatedVoucher = voucherService.update(id, voucherDTO);
            return new ResponseEntity<>(updatedVoucher, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    MessageReponse.builder()
                            .message(e.getMessage())
                            .status(HttpStatus.NOT_FOUND.value())
                            .build()
            );
        }
    }

    @PreAuthorize("hasAuthority('UPDATE_VOUCHER')")
    @PutMapping("/{id}/status")
    public ResponseEntity<?> changeStatus(@PathVariable Integer id) {
        try {
            VoucherResponse updatedVoucher = voucherService.changeStatus(id);
            return ResponseEntity.ok(updatedVoucher);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }


    @GetMapping("detail/{id}")
    public ResponseEntity<MessageReponse> getVoucherById(@PathVariable("id") Integer id) {
        try {
            Voucher voucher = voucherService.getById(id);
            VoucherResponse voucherResponse = VoucherResponse.fromVoucher(voucher);
            return ResponseEntity.ok().body(MessageReponse.builder()
                    .message("Lấy thông tin thành công")
                    .status(HttpStatus.OK.value())
                    .data(voucherResponse)
                    .build());
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    @PreAuthorize("hasAuthority('DELETE_VOUCHER')")
    @DeleteMapping("{id}")
    public ResponseEntity<Void> deleteVoucher(@PathVariable("id") Integer id) {
        try {
            voucherService.delete(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }


}
