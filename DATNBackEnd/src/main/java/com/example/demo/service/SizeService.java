package com.example.demo.service;

import com.example.demo.dto.SizeDTO;
import com.example.demo.entity.Size;

import java.util.List;

public interface SizeService {
    List<Size> getAll();

    Size add(SizeDTO size);

    Size update(Integer id, SizeDTO size) throws Exception;

    Size getSizeById(Integer id) throws Exception;

    void deleteSize(Integer id) throws Exception;
    Size findById(Integer id);

    boolean canDeleteSize(Integer sizeId);
}
