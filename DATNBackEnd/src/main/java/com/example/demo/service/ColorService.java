package com.example.demo.service;

import com.example.demo.dto.ColorDTO;
import com.example.demo.dto.SizeDTO;
import com.example.demo.entity.Color;
import com.example.demo.entity.Size;
import org.springframework.dao.DuplicateKeyException;

import java.util.List;

public interface ColorService {
    List<Color> getAll();

    Color add(ColorDTO colorDTO);

    Color update(Integer id, ColorDTO color) throws Exception;

    Color getColorById(Integer id) throws Exception;

    void deleteColor(Integer id) throws Exception;
    Color findById(Integer id);

    boolean canDeleteColor(Integer colorId);
}
