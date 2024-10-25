package com.example.demo.service;

import com.example.demo.dto.VoucherDTO;
import com.example.demo.entity.Voucher;
import com.example.demo.response.VoucherResponse;
import org.w3c.dom.stylesheets.LinkStyle;

import java.util.List;

public interface VoucherService {
    List<Voucher> getAll();
    VoucherResponse add(VoucherDTO voucherDTO);
    VoucherResponse update(Integer id, VoucherDTO voucherDTO) throws Exception;
    Voucher getById(Integer id) throws Exception;
    void delete(Integer id) throws Exception;
    VoucherResponse updateCustomer(Integer id, Integer customerId) throws Exception;

}
