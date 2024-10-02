package com.example.demo.service.impl;

import com.example.demo.dto.SleeveDTO;
import com.example.demo.entity.Sleeve;
import com.example.demo.repository.SleeveRepo;
import com.example.demo.service.SleeveService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SleeveServiceImpl implements SleeveService {
    private final SleeveRepo sleeveRepo;
    @Override
    public List<Sleeve> getAll() {
        return sleeveRepo.findAll();
    }

    @Override
    public Sleeve add(SleeveDTO sleeveDTO) {
        return sleeveRepo.save(SleeveDTO.convertCollar(sleeveDTO));
    }

    @Override
    public Sleeve update(Integer id, SleeveDTO sleeveDTO) {
        Sleeve sleeve = sleeveRepo.findById(id).orElseThrow(()->new RuntimeException("Not found sleeve with id:"+id));
        sleeve.setCode(sleeveDTO.getCode());
        sleeve.setName(sleeveDTO.getName());
        sleeve.setStatus(sleeveDTO.getStatus());
        return sleeveRepo.save(sleeve);
    }

    @Override
    public Sleeve getSleeveById(Integer id) {
        return sleeveRepo.findById(id).orElseThrow(()->new RuntimeException("Not found sleeve with id:"+id));
    }

    @Override
    public void deleteSleeve(Integer id) {
        for (Sleeve sleeve: sleeveRepo.findAll()
        ) {
            if(sleeve.getId()==id){
                sleeveRepo.delete(sleeve);
            }
        }
    }
}
