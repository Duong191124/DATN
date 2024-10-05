package com.example.demo.service;

import com.example.demo.dto.SleeveDTO;
import com.example.demo.entity.Sleeve;

import java.util.List;

public interface SleeveService {
    List<Sleeve> getAll();

<<<<<<< HEAD
    Sleeve create(SleeveDTO sleeveDTO);

    Sleeve update(Integer id, SleeveDTO sleeveDTO);

    void delete(Integer id);
=======
    Sleeve add(SleeveDTO sleeveDTO);

    Sleeve update(Integer id, SleeveDTO sleeveDTO);

    Sleeve getSleeveById(Integer id);

    void deleteSleeve(Integer id);
>>>>>>> 2737feb9f6b602c7b2f4ffe0782eb9372e6c60e0
}
