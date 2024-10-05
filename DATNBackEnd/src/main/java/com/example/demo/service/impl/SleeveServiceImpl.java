package com.example.demo.service.impl;

import com.example.demo.dto.SleeveDTO;
import com.example.demo.entity.Sleeve;
import com.example.demo.repository.SleeveRepo;
import com.example.demo.service.SleeveService;
<<<<<<< HEAD
import org.springframework.beans.factory.annotation.Autowired;
=======
import lombok.RequiredArgsConstructor;
>>>>>>> 2737feb9f6b602c7b2f4ffe0782eb9372e6c60e0
import org.springframework.stereotype.Service;

import java.util.List;

@Service
<<<<<<< HEAD
public class SleeveServiceImpl implements SleeveService {

    @Autowired
    private SleeveRepo sleeveRepo;

=======
@RequiredArgsConstructor
public class SleeveServiceImpl implements SleeveService {
    private final SleeveRepo sleeveRepo;
>>>>>>> 2737feb9f6b602c7b2f4ffe0782eb9372e6c60e0
    @Override
    public List<Sleeve> getAll() {
        return sleeveRepo.findAll();
    }

    @Override
<<<<<<< HEAD
    public Sleeve create(SleeveDTO sleeveDTO) {
        Sleeve newSleeve = Sleeve.builder()
                .code(sleeveDTO.getCode())
                .name(sleeveDTO.getName())
                .status(1)
                .build();
        return sleeveRepo.save(newSleeve);
=======
    public Sleeve add(SleeveDTO sleeveDTO) {
        return sleeveRepo.save(SleeveDTO.convertCollar(sleeveDTO));
>>>>>>> 2737feb9f6b602c7b2f4ffe0782eb9372e6c60e0
    }

    @Override
    public Sleeve update(Integer id, SleeveDTO sleeveDTO) {
<<<<<<< HEAD
        Sleeve existingSleeve = sleeveRepo.findById(id).orElse(null);

        existingSleeve.setCode(sleeveDTO.getCode());
        existingSleeve.setName(sleeveDTO.getName());
        existingSleeve.setStatus(sleeveDTO.getStatus());

        return sleeveRepo.save(existingSleeve);
    }

    @Override
    public void delete(Integer id) {
        sleeveRepo.deleteById(id);
=======
        Sleeve sleeve = sleeveRepo.findById(id).orElseThrow(()->new RuntimeException("Not found sleeve with id:"+id));
        sleeve.setCode(sleeveDTO.getCode());
        sleeve.setName(sleeveDTO.getName());
        sleeve.setStatus(sleeveDTO.getStatus());
        return sleeveRepo.save(sleeve);
    }

    @Override
    public Sleeve getSleeveById(Integer id) {
        return sleeveRepo.findById(id).orElseThrow(()->new RuntimeException("Not found sleeve with id:"+id));
    }

    @Override
    public void deleteSleeve(Integer id) {
        for (Sleeve sleeve: sleeveRepo.findAll()
        ) {
            if(sleeve.getId()==id){
                sleeveRepo.delete(sleeve);
            }
        }
>>>>>>> 2737feb9f6b602c7b2f4ffe0782eb9372e6c60e0
    }
}
