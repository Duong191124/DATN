package com.example.demo.service.impl;

import com.example.demo.dto.ColorDTO;
import com.example.demo.entity.Color;
import com.example.demo.repository.ColorRepo;
import com.example.demo.service.ColorService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class ColorServiceImpl implements ColorService {

    private final ColorRepo colorRepo;

    @Override
    public List<Color> getAll() {
        return colorRepo.findAll();
    }

    @Override
    public Color add(ColorDTO color) {
        Color newColor = Color.builder()
                .name(color.getName())
                .code(color.getCode())
                .status(color.getStatus())
                .build();
        return colorRepo.save(newColor);
    }

    @Override
    public Color update(Integer id, ColorDTO color) throws Exception {
        Color existingColor = getColorById(id);
        existingColor.setName(color.getName());
        existingColor.setCode(color.getCode());
        existingColor.setStatus(color.getStatus());
        return colorRepo.save(existingColor);
    }

    @Override
    public Color getColorById(Integer id) throws Exception {
        return colorRepo.findById(id).orElseThrow(() -> new Exception(""));
    }

    @Override
    public void deleteColor(Integer id) throws Exception {
        Color existingColor = getColorById(id);
        colorRepo.delete(existingColor);
    }
}
