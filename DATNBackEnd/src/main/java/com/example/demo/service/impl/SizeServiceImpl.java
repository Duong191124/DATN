package com.example.demo.service.impl;

import com.example.demo.dto.SizeDTO;
import com.example.demo.entity.Size;
import com.example.demo.repository.SizeRepo;
import com.example.demo.service.SizeService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class SizeServiceImpl implements SizeService {

    private final SizeRepo sizeRepo;

    @Override
    public List<Size> getAll() {
        return sizeRepo.findAll();
    }

    @Override
    public Size add(SizeDTO size) {
        Size newColor = Size.builder()
                .name(size.getName())
                .code(size.getCode())
                .status(1)
                .build();
        return sizeRepo.save(newColor);
    }


    public boolean isDuplicate(String type, String value) {
        if ("code".equals(type)) {
            return sizeRepo.existsByCode(value);
        } else if ("name".equals(type)) {
            return sizeRepo.existsByName(value);
        }
        return false;
    }

    @Override
    public Size update(Integer id, SizeDTO size) throws Exception {
        Size existingSize = getSizeById(id);
        existingSize.setName(size.getName());
        existingSize.setCode(size.getCode());
        existingSize.setStatus(size.getStatus());
        return sizeRepo.save(existingSize);
    }

    @Override
    public Size getSizeById(Integer id) throws Exception {
        return sizeRepo.findById(id).orElseThrow(() -> new Exception(""));
    }

    @Override
    public void deleteSize(Integer id) throws Exception {
        Size existingSize = getSizeById(id);
        sizeRepo.delete(existingSize);
    }

    @Override
    public Size findById(Integer id) {
        return sizeRepo.findById(id).orElseThrow(()->new RuntimeException("not found size with id:"+id));
    }
}
