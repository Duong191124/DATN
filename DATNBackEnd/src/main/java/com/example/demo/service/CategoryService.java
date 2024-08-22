package com.example.demo.service;

import com.example.demo.dto.CategoryDTO;
import com.example.demo.entity.Category;
import com.example.demo.repository.CategoryRepo;
import com.example.demo.service.impl.CategoryServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class CategoryService implements CategoryServiceImpl {

    private final CategoryRepo categoryRepo;

    @Override
    public List<Category> getAll() {
        return categoryRepo.findAll();
    }

    @Override
    public Category add(CategoryDTO category) {
        Category newCategory = Category.builder()
                .name(category.getName())
                .build();
        return categoryRepo.save(newCategory);
    }

    @Override
    public Category update(Integer id, CategoryDTO category) throws Exception {
        Category existingCategory = getCategoryById(id);
        existingCategory.setName(category.getName());
        return categoryRepo.save(existingCategory);
    }

    @Override
    public Category getCategoryById(Integer id) throws Exception {
        return categoryRepo.findById(id).orElseThrow(() -> new Exception("Id category is not found"));
    }

    @Override
    public void deleteCategory(Integer id) throws Exception {
        Category existingCategory = getCategoryById(id);
        categoryRepo.delete(existingCategory);
    }
}
