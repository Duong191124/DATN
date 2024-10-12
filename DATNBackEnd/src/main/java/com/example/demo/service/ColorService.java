package com.example.demo.service;

import com.example.demo.dto.ColorDTO;
import com.example.demo.entity.Color;

import java.util.List;

public interface ColorService {
    List<Color> getAll();

    Color add(ColorDTO color);

    Color update(Integer id, ColorDTO color) throws Exception;

    Color getColorById(Integer id) throws Exception;

    void deleteColor(Integer id) throws Exception;
}
