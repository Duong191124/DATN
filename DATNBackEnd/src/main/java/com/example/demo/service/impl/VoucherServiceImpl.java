package com.example.demo.service.impl;

import com.example.demo.dto.VoucherDTO;
import com.example.demo.entity.Voucher;
import org.w3c.dom.stylesheets.LinkStyle;

import java.util.List;

public interface VoucherServiceImpl {
    List<Voucher> getAll();
    Voucher add(VoucherDTO voucherDTO);
    Voucher update(Integer id, VoucherDTO voucherDTO) throws Exception;
    Voucher getById(Integer id) throws Exception;
    void delete(Integer id) throws Exception;
}
