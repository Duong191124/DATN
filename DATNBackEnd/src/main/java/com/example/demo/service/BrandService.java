package com.example.demo.service;

import com.example.demo.dto.BrandDTO;
import com.example.demo.entity.Brand;
import com.example.demo.repository.BrandRepo;
import com.example.demo.service.impl.BrandServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class BrandService implements BrandServiceImpl {

    private final BrandRepo brandRepo;

    @Override
    public List<Brand> getAll() {
        return brandRepo.findAll();
    }

    @Override
    public Brand add(BrandDTO brand) {
        Brand newBrand = Brand.builder()
                .name(brand.getName())
                .code(brand.getCode())
                .status(brand.getStatus())
                .build();
        return brandRepo.save(newBrand);
    }

    @Override
    public Brand update(Integer id, BrandDTO brand) throws Exception {
        Brand existingBrand = getBrandById(id);
        existingBrand.setName(brand.getName());
        existingBrand.setCode(brand.getCode());
        existingBrand.setStatus(brand.getStatus());
        return brandRepo.save(existingBrand);
    }

    @Override
    public Brand getBrandById(Integer id) throws Exception {
        return brandRepo.findById(id).orElseThrow(() -> new Exception(""));
    }

    @Override
    public void deleteBrand(Integer id) throws Exception {
        Brand existingBrand = getBrandById(id);
        brandRepo.delete(existingBrand);
    }
}
