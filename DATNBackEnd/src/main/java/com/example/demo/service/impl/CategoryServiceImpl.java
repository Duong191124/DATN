package com.example.demo.service.impl;

import com.example.demo.dto.CategoryDTO;

import java.util.List;

public interface CategoryServiceImpl {
    List<Category> getAll();

    Category add(CategoryDTO category);

    Category update(Integer id, CategoryDTO category) throws Exception;

    Category getCategoryById(Integer id) throws Exception;

    void deleteCategory(Integer id) throws Exception;
}
