package com.example.demo.service;

import com.example.demo.dto.SleeveDTO;
import com.example.demo.entity.Sleeve;

import java.util.List;

public interface SleeveService {
    List<Sleeve> getAll();

    Sleeve update(Integer id, SleeveDTO sleeveDTO);

    Sleeve add(SleeveDTO sleeveDTO);

    Sleeve getSleeveById(Integer id);

    void deleteSleeve(Integer id);

    boolean canDeleteSleeve(Integer sleeveId);
}
