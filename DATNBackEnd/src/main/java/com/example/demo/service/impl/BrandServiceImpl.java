package com.example.demo.service.impl;

import com.example.demo.dto.BrandDTO;
import com.example.demo.entity.Brand;
import com.example.demo.entity.Product;
import com.example.demo.repository.BrandRepo;
import com.example.demo.repository.ProductRepo;
import com.example.demo.service.BrandService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class BrandServiceImpl implements BrandService {

    private final BrandRepo brandRepo;

    private final ProductRepo productRepo;

    @Override
    public List<Brand> getAll() {
        return brandRepo.findAll();
    }

    @Override
    public Brand add(BrandDTO brand) {
        Brand newBrand = Brand.builder()
                .name(brand.getName())
                .code(brand.getCode())
                .status(1)
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

//    @Override
//    public void deleteBrand(Integer id) throws Exception {
//        Brand existingBrand = getBrandById(id);
//        brandRepo.delete(existingBrand);
//    }

    @Override
    public boolean candeleteBrand(Integer brandId) {
        //Kiểm tra xem có product nào liên quan đến brand không
        List<Product> relateProduct = productRepo.findByBrandId(brandId);
        return relateProduct.isEmpty();//trả về true nếu không có liên kết
    }

    @Override
    public void deleteBrand(Integer brandId) throws Exception {
        if (candeleteBrand(brandId)) {
            brandRepo.deleteById(brandId);
        } else {
            throw new IllegalStateException("Cannot delete brand, it has related products.");
        }
    }
}
