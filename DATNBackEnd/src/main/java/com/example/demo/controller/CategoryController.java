package com.example.demo.controller;

import com.example.demo.dto.CategoryDTO;
import com.example.demo.entity.Category;
import com.example.demo.response.MessageReponse;
import com.example.demo.service.impl.CategoryServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.prefix}/category")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryServiceImpl categoryService;

    private final MessageSource messageSource;

    @GetMapping("")
    public ResponseEntity<MessageReponse> getAll() {
        List<Category> categoryList = categoryService.getAll();
        return ResponseEntity.ok().body(MessageReponse.builder()
                .message("Lay thong tin thanh cong")
                .status(HttpStatus.OK.value())
                .data(categoryList)
                .build());
    }

    @PostMapping("")
    public ResponseEntity<MessageReponse> add(@Valid @RequestBody CategoryDTO category, BindingResult result) {
        if (result.hasErrors()) {
            List<String> errorMessage = result.getFieldErrors()
                    .stream()
                    .map(FieldError::getDefaultMessage)
                    .toList();
            return ResponseEntity.badRequest().body(MessageReponse.builder()
                    .message(errorMessage.toString())
                    .status(HttpStatus.BAD_REQUEST.value())
                    .build());
        }
        Category newCategory = categoryService.add(category);
        return ResponseEntity.status(HttpStatus.CREATED).body(MessageReponse.builder()
                .message("create category success")
                .status(HttpStatus.CREATED.value())
                .data(newCategory)
                .build());
    }

    @PutMapping("{id}")
    public ResponseEntity<?> update(
            @PathVariable("id") Integer id,
            @RequestBody CategoryDTO categoryDTO) throws Exception {
        categoryService.update(id, categoryDTO);
        return ResponseEntity.ok().body(MessageReponse.builder()
                .message("update category success")
                .status(HttpStatus.OK.value())
                .data(categoryDTO)
                .build());
    }

    @DeleteMapping("{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) throws Exception {
        try {
            categoryService.deleteCategory(id);
            return ResponseEntity.ok().body(MessageReponse.builder()
                    .message("delete category success")
                    .status(HttpStatus.OK.value())
                    .build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }


}
