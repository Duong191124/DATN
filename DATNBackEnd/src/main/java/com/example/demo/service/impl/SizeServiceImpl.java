package com.example.demo.service.impl;

import com.example.demo.dto.SizeDTO;

import java.util.List;

public interface SizeServiceImpl {
    List<Size> getAll();

    Size add(SizeDTO size);

    Size update(Integer id, SizeDTO size) throws Exception;

    Size getSizeById(Integer id) throws Exception;

    void deleteSize(Integer id) throws Exception;
}
