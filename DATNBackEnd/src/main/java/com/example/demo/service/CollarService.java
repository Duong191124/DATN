package com.example.demo.service;

import com.example.demo.dto.CollarDTO;
import com.example.demo.entity.Collar;

import java.util.List;

public interface CollarService {
    List<Collar> getAll();

    Collar create(CollarDTO collarDTO);

    Collar update(Integer id, CollarDTO collarDTO);

    void delete(Integer id);
}
