package com.example.demo.service;

import com.example.demo.dto.WeightDTO;
import com.example.demo.entity.Weight;

import java.util.List;

public interface WeightService {
    List<Weight> getAll();

    Weight createWeight(WeightDTO weightDTO);

    Weight updateWeight(Integer id,WeightDTO weightDTO) throws  Exception;

    Weight findById(Integer id) throws Exception;

}
