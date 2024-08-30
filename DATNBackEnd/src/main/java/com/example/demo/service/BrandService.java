package com.example.demo.service;

import com.example.demo.dto.BrandDTO;
import com.example.demo.entity.Brand;

import java.util.List;

public interface BrandService {
    List<Brand> getAll();

    Brand add(BrandDTO brand);

    Brand update(Integer id, BrandDTO brand) throws Exception;

    Brand getBrandById(Integer id) throws Exception;

    void deleteBrand(Integer id) throws Exception;
}
