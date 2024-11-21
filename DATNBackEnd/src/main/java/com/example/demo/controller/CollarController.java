package com.example.demo.controller;

import com.example.demo.dto.CollarDTO;
import com.example.demo.entity.Collar;
import com.example.demo.response.MessageReponse;
import com.example.demo.service.CollarService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.prefix}/collar")
public class CollarController {
    @Autowired
    private CollarService collarService;

    // Lấy tất cả các cổ áo
    @GetMapping
    public ResponseEntity<List<Collar>> getAllCollars() {
        List<Collar> collars = collarService.getAll();
        return ResponseEntity.ok(collars);
    }

    // Thêm một cổ áo mới
    @PreAuthorize("hasAuthority('CREATE_COLLAR')")
    @PostMapping()
    public ResponseEntity<?> addCollar(@Valid @RequestBody CollarDTO collarDTO, BindingResult result) {
        try {
            if(result.hasErrors()){
                List<String> errorMessage = result.getFieldErrors().stream().map(FieldError::getDefaultMessage).toList();
                return ResponseEntity.badRequest().body(errorMessage);
            }
            Collar newCollar = collarService.add(collarDTO);
            return ResponseEntity.status(201).body(new MessageReponse("add successfully", 1, newCollar));
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Cập nhật cổ áo theo id
    @PreAuthorize("hasAuthority('UPDATE_COLLAR')")
    @PutMapping("/{id}")
    public ResponseEntity<?> updateCollar(@PathVariable Integer id, @Valid @RequestBody CollarDTO collarDTO,BindingResult result) {
        try {
            if(result.hasErrors()){
                List<String> errorMessage = result.getFieldErrors().stream().map(FieldError::getDefaultMessage).toList();
                return ResponseEntity.badRequest().body(errorMessage);
            }
            Collar updatedCollar = collarService.update(id, collarDTO);
            return ResponseEntity.ok(new MessageReponse("update successfully", 1, updatedCollar));
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Lấy cổ áo theo id

    @GetMapping("/{id}")
    public ResponseEntity<?> getCollarById(@PathVariable Integer id) {
        try {
            Collar collar = collarService.getCollarById(id);
            return ResponseEntity.ok(new MessageReponse("find successfully", 1, collar));
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Xóa cổ áo theo id
    @PreAuthorize("hasAuthority('DELETE_COLLAR')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCollar(@PathVariable Integer id) {
        try {
            collarService.deleteCollar(id);
            return ResponseEntity.ok().body(MessageReponse.builder()
                    .message("delete collar successfully")
                    .status(HttpStatus.OK.value())
                    .build());

        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
