package com.example.demo.service.impl;

import com.example.demo.dto.ColorDTO;

import java.util.List;

public interface ColorServiceImpl {
    List<Color> getAll();

    Color add(ColorDTO color);

    Color update(Integer id, ColorDTO color) throws Exception;

    Color getColorById(Integer id) throws Exception;

    void deleteColor(Integer id) throws Exception;
}
