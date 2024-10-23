package com.example.demo.service.impl;

import com.example.demo.dto.SleeveDTO;
import com.example.demo.entity.Product;
import com.example.demo.entity.Sleeve;
import com.example.demo.repository.ProductRepo;
import com.example.demo.repository.SleeveRepo;
import com.example.demo.service.SleeveService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SleeveServiceImpl implements SleeveService {
    private final SleeveRepo sleeveRepo;
    private final ProductRepo productRepo;

    @Override
    public List<Sleeve> getAll() {
        return sleeveRepo.findAll();
    }

    public Sleeve add(SleeveDTO sleeveDTO) {
        return sleeveRepo.save(SleeveDTO.convertCollar(sleeveDTO));
    }

    @Override
    public Sleeve update(Integer id, SleeveDTO sleeveDTO) {
        Sleeve existingSleeve = sleeveRepo.findById(id).orElse(null);

        existingSleeve.setCode(sleeveDTO.getCode());
        existingSleeve.setName(sleeveDTO.getName());
        existingSleeve.setStatus(sleeveDTO.getStatus());

        return sleeveRepo.save(existingSleeve);
    }

    @Override
    public Sleeve getSleeveById(Integer id) {
        return sleeveRepo.findById(id).orElseThrow(() -> new RuntimeException("Not found sleeve with id:" + id));
    }


    @Override
    public boolean canDeleteSleeve(Integer sleeveId) {
        List<Product> relateProduct = productRepo.findBySleeveId(sleeveId);
        return relateProduct.isEmpty();
    }

    @Override
    public void deleteSleeve(Integer id) {
        if (canDeleteSleeve(id)) {
            sleeveRepo.deleteById(id);
        } else {
            throw new IllegalStateException("cannot delete sleeve, because it has related products");
        }
    }
}
