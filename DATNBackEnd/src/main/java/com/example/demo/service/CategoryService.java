package com.example.demo.service;

import com.example.demo.dto.CategoryDTO;
import com.example.demo.entity.Category;

import java.util.List;

public interface CategoryService {
    List<Category> getAll();

    Category add(CategoryDTO category);

    Category update(Integer id, CategoryDTO category) throws Exception;

    Category getCategoryById(Integer id) throws Exception;

    void deleteCategory(Integer id) throws Exception;

    boolean canDeleteCategory(Integer categoryId);
}
