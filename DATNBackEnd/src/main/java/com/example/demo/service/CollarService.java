package com.example.demo.service;

import com.example.demo.dto.CollarDTO;
import com.example.demo.entity.Collar;

import java.util.List;

public interface CollarService {
    List<Collar> getAll();

    Collar update(Integer id, CollarDTO collarDTO);

    Collar add(CollarDTO collarDTO);

    Collar getCollarById(Integer id);

    void deleteCollar(Integer id);
}
