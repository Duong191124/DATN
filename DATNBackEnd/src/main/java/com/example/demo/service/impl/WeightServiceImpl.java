package com.example.demo.service.impl;

import com.example.demo.dto.WeightDTO;
import com.example.demo.entity.Weight;
import com.example.demo.repository.WeightRepo;
import com.example.demo.service.WeightService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
@RequiredArgsConstructor
@Service
public class WeightServiceImpl implements WeightService {
    private final WeightRepo weightRepo;

    @Override
    public List<Weight> getAll() {
        return weightRepo.findAll();
    }

    @Override
    public Weight createWeight(WeightDTO weightDTO) {
         Weight newWeight = Weight.builder()
//                 .name(weightDTO.getName())
//                 .code(weightDTO.getCode())
                 .weightValue(weightDTO.getWeight_value())
                 .status(1)
                 .build();
         return weightRepo.save(newWeight);

    }

    @Override
    public Weight updateWeight(Integer id, WeightDTO weightDTO) throws Exception {
        Weight existingWeight = findById(id);
//        existingWeight.setName(weightDTO.getName());
//        existingWeight.setCode(weightDTO.getCode());
        existingWeight.setWeightValue(weightDTO.getWeight_value());
        existingWeight.setStatus(weightDTO.getStatus());
        return weightRepo.save(existingWeight);

    }

    @Override
    public Weight findById(Integer id) throws Exception {
        return weightRepo.findById(id).orElseThrow(() -> new Exception(""));
    }
}
