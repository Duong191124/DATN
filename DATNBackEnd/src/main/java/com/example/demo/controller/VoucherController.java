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

    @GetMapping("")
    public ResponseEntity<MessageReponse> getAllVouchers() {
        List<VoucherResponse> voucherList = voucherService.getAll()
                .stream()
                .map(VoucherResponse::fromVoucherResponse)
                .toList();
        return ResponseEntity.ok().body(MessageReponse.builder()
                .message("lay thong tin thanh cong")
                .status(HttpStatus.OK.value())
                .data(voucherList)
                .build()
        );
    }

    @PostMapping("")
    public ResponseEntity<?> createVoucher(@Valid @RequestBody VoucherDTO voucherDTO, BindingResult result) {
        if(result.hasErrors()){
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

    @PutMapping("{id}")
    public ResponseEntity<?> updateVoucher(@PathVariable("id") Integer id,
                                           @Valid @RequestBody VoucherDTO voucherDTO,
                                           BindingResult result) {
        if(result.hasErrors()){
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


    @GetMapping("detail/{id}")
    public ResponseEntity<MessageReponse> getVoucherById(@PathVariable("id") Integer id) {
        try {
            Voucher voucher = voucherService.getById(id);
            VoucherResponse voucherResponse = VoucherResponse.fromVoucherResponse(voucher);
            return ResponseEntity.ok().body(MessageReponse.builder()
                    .message("lay thong tin thanh cong")
                    .status(HttpStatus.OK.value())
                    .data(voucherResponse)
                    .build());
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

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
