package com.example.demo.service;

import com.example.demo.dto.SleeveDTO;
import com.example.demo.entity.Sleeve;

import java.util.List;

public interface SleeveService {
    List<Sleeve> getAll();

    Sleeve create(SleeveDTO sleeveDTO);

    Sleeve update(Integer id, SleeveDTO sleeveDTO);

    void delete(Integer id);
}
