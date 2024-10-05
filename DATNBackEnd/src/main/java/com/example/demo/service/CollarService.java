package com.example.demo.service;

import com.example.demo.dto.CollarDTO;
import com.example.demo.entity.Collar;

import java.util.List;

public interface CollarService {
    List<Collar> getAll();

<<<<<<< HEAD
    Collar create(CollarDTO collarDTO);

    Collar update(Integer id, CollarDTO collarDTO);

    void delete(Integer id);
=======
    Collar add(CollarDTO collarDTO);

    Collar update(Integer id, CollarDTO collarDTO);

    Collar getCollarById(Integer id);

    void deleteCollar(Integer id);
>>>>>>> 2737feb9f6b602c7b2f4ffe0782eb9372e6c60e0
}
