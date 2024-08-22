package com.example.demo.controller;

import com.example.demo.dto.CategoryDTO;
import com.example.demo.entity.Category;
import com.example.demo.response.MessageReponse;
import com.example.demo.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.*;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("api/v1/category")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping("")
    public ResponseEntity<MessageReponse> getAll(){
        List<Category> categoryList = categoryService.getAll();
        return ResponseEntity.ok().body(MessageReponse.builder()
                .message("Lay thong tin thanh cong")
                .status(HttpStatus.OK.value())
                .data(categoryList)
                .build());
    }

    @PostMapping("")
    public ResponseEntity<MessageReponse> add(@Valid @RequestBody CategoryDTO category, BindingResult result){
        if(result.hasErrors()){
            List<String> errorMessage = result.getFieldErrors()
                    .stream()
                    .map(FieldError::getDefaultMessage)
                    .toList();
            return ResponseEntity.badRequest().body(MessageReponse.builder()
                    .message(errorMessage.toString())
                    .status(HttpStatus.BAD_REQUEST.value())
                    .data(null)
                    .build());
        }
        Category newCategory = categoryService.add(category);
        return ResponseEntity.status(HttpStatus.CREATED).body(MessageReponse.builder()
                .message("Create category successfully")
                .status(HttpStatus.CREATED.value())
                .data(newCategory)
                .build());
    }

    @DeleteMapping("{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) throws Exception{
        categoryService.deleteCategory(id);
        return ResponseEntity.ok().body(MessageReponse.builder()
                .message("Delete category with id= " + id + " successfully")
                .status(HttpStatus.OK.value())
                .build());
    }

}
