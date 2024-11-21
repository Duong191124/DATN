package com.example.demo.controller;

import com.example.demo.dto.SleeveDTO;
import com.example.demo.entity.Sleeve;
import com.example.demo.response.MessageReponse;
import com.example.demo.service.SleeveService;
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
@RequestMapping("${api.prefix}/sleeves")
public class SleeveController {
    @Autowired
    private SleeveService sleeveService;

    // Lấy tất cả các ống tay
    @GetMapping
    public ResponseEntity<List<Sleeve>> getAllSleeves() {
        List<Sleeve> sleeves = sleeveService.getAll();
        return ResponseEntity.ok(sleeves);
    }

    // Thêm một ống tay mới
    @PreAuthorize("hasAuthority('CREATE_SLEEVE')")
    @PostMapping
    public ResponseEntity<?> addSleeve(@Valid @RequestBody SleeveDTO sleeveDTO, BindingResult result) {
        try {
            if (result.hasErrors()) {
                List<String> errorMessage = result.getFieldErrors().stream()
                        .map(FieldError::getDefaultMessage)
                        .toList();
                return ResponseEntity.badRequest().body(errorMessage);
            }
            Sleeve newSleeve = sleeveService.add(sleeveDTO);
            return ResponseEntity.status(201).body(new MessageReponse("add successfully", 1, newSleeve));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Cập nhật ống tay theo id
    @PreAuthorize("hasAuthority('UPDATE_SLEEVE')")
    @PutMapping("/{id}")
    public ResponseEntity<?> updateSleeve(@PathVariable Integer id, @Valid @RequestBody SleeveDTO sleeveDTO, BindingResult result) {
        try {
            if (result.hasErrors()) {
                List<String> errorMessage = result.getFieldErrors().stream()
                        .map(FieldError::getDefaultMessage)
                        .toList();
                return ResponseEntity.badRequest().body(errorMessage);
            }
            Sleeve updatedSleeve = sleeveService.update(id, sleeveDTO);
            return ResponseEntity.ok(new MessageReponse("update successfully", 1, updatedSleeve));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Lấy ống tay theo id
    @GetMapping("/{id}")
    public ResponseEntity<?> getSleeveById(@PathVariable Integer id) {
        try {
            Sleeve sleeve = sleeveService.getSleeveById(id);
            return ResponseEntity.ok(new MessageReponse("find successfully", 1, sleeve));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Xóa ống tay theo id
    @PreAuthorize("hasAuthority('DELETE_SLEEVE')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSleeve(@PathVariable Integer id) {
        try {
            sleeveService.deleteSleeve(id);
            return ResponseEntity.ok().body(MessageReponse.builder()
                    .message("delete product successdully")
                    .status(HttpStatus.OK.value())
                    .build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
