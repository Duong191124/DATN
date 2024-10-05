package com.example.demo.service.impl;

import com.example.demo.dto.CollarDTO;
import com.example.demo.entity.Collar;
import com.example.demo.repository.CollarRepo;
import com.example.demo.service.CollarService;
<<<<<<< HEAD
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CollarServiceImpl implements CollarService {

    @Autowired
    private CollarRepo collarRepo;

=======
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
@RequiredArgsConstructor
public class CollarServiceImpl implements CollarService {
    private final CollarRepo collarRepo;
>>>>>>> 2737feb9f6b602c7b2f4ffe0782eb9372e6c60e0
    @Override
    public List<Collar> getAll() {
        return collarRepo.findAll();
    }

    @Override
<<<<<<< HEAD
    public Collar create(CollarDTO collarDTO) {
        Collar newCollar = Collar.builder()
                .name(collarDTO.getName())
                .code(collarDTO.getCode())
                .status(1)
                .build();
        return collarRepo.save(newCollar);
=======
    public Collar add(CollarDTO collarDTO) {
        return collarRepo.save(CollarDTO.convertCollar(collarDTO));
>>>>>>> 2737feb9f6b602c7b2f4ffe0782eb9372e6c60e0
    }

    @Override
    public Collar update(Integer id, CollarDTO collarDTO) {
<<<<<<< HEAD
        Collar existingCollar = collarRepo.findById(id).orElse(null);

        existingCollar.setCode(collarDTO.getCode());
        existingCollar.setName(collarDTO.getName());
        existingCollar.setStatus(collarDTO.getStatus());
        return collarRepo.save(existingCollar);
    }

    @Override
    public void delete(Integer id) {
        collarRepo.deleteById(id);
=======
        Collar collar = collarRepo.findById(id).orElseThrow(()->new RuntimeException("Not found collar with id:"+id));
        collar.setCode(collarDTO.getCode());
        collar.setName(collarDTO.getName());
        collar.setStatus(collarDTO.getStatus());
        return collarRepo.save(collar);
    }

    @Override
    public Collar getCollarById(Integer id) {
        return collarRepo.findById(id).orElseThrow(()->new RuntimeException("Not found collar with id:"+id));
    }

    @Override
    public void deleteCollar(Integer id) {
        for (Collar collar: collarRepo.findAll()
             ) {
            if(collar.getId()==id){
                collarRepo.delete(collar);
            }
        }
>>>>>>> 2737feb9f6b602c7b2f4ffe0782eb9372e6c60e0
    }
}
