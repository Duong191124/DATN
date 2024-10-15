package com.example.demo.service.impl;

import com.example.demo.dto.CollarDTO;
import com.example.demo.entity.Collar;
import com.example.demo.repository.CollarRepo;
import com.example.demo.service.CollarService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
@RequiredArgsConstructor
public class CollarServiceImpl implements CollarService {
    private final CollarRepo collarRepo;
    @Override
    public List<Collar> getAll() {
        return collarRepo.findAll();
    }

    public Collar add(CollarDTO collarDTO) {
        return collarRepo.save(CollarDTO.convertCollar(collarDTO));
    }

    @Override
    public Collar update(Integer id, CollarDTO collarDTO) {
        Collar existingCollar = collarRepo.findById(id).orElse(null);

        existingCollar.setCode(collarDTO.getCode());
        existingCollar.setName(collarDTO.getName());
        existingCollar.setStatus(collarDTO.getStatus());
        return collarRepo.save(existingCollar);
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
    }
}
