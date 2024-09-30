package com.example.demo.service.impl;

import com.example.demo.dto.SleeveDTO;
import com.example.demo.entity.Sleeve;
import com.example.demo.repository.SleeveRepo;
import com.example.demo.service.SleeveService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SleeveServiceImpl implements SleeveService {

    @Autowired
    private SleeveRepo sleeveRepo;

    @Override
    public List<Sleeve> getAll() {
        return sleeveRepo.findAll();
    }

    @Override
    public Sleeve create(SleeveDTO sleeveDTO) {
        Sleeve newSleeve = Sleeve.builder()
                .code(sleeveDTO.getCode())
                .name(sleeveDTO.getName())
                .status(1)
                .build();
        return sleeveRepo.save(newSleeve);
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
    public void delete(Integer id) {
        sleeveRepo.deleteById(id);
    }
}
