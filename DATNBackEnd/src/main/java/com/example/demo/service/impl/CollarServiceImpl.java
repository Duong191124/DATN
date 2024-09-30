package com.example.demo.service.impl;

import com.example.demo.dto.CollarDTO;
import com.example.demo.entity.Collar;
import com.example.demo.repository.CollarRepo;
import com.example.demo.service.CollarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CollarServiceImpl implements CollarService {

    @Autowired
    private CollarRepo collarRepo;

    @Override
    public List<Collar> getAll() {
        return collarRepo.findAll();
    }

    @Override
    public Collar create(CollarDTO collarDTO) {
        Collar newCollar = Collar.builder()
                .name(collarDTO.getName())
                .code(collarDTO.getCode())
                .status(1)
                .build();
        return collarRepo.save(newCollar);
    }

    @Override
    public Collar update(Integer id, CollarDTO collarDTO) {
        Collar existingCollar = collarRepo.findById(id).orElse(null);

        existingCollar.setCode(collarDTO.getCode());
        existingCollar.setName(collarDTO.getName());
        existingCollar.setStatus(collarDTO.getStatus());
        return collarRepo.save(existingCollar);
    }

    @Override
    public void delete(Integer id) {
        collarRepo.deleteById(id);
    }
}
