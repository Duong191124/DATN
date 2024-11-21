package com.example.demo.controller;

import com.example.demo.dto.WeightDTO;
import com.example.demo.entity.Weight;
import com.example.demo.response.MessageReponse;
import com.example.demo.service.WeightService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.prefix}/weight")
@RequiredArgsConstructor
public class WeightController {
    private final WeightService weightService;
    @PreAuthorize("hasAuthority('READ_WEIGHT')")
    @GetMapping
    public ResponseEntity<MessageReponse> getAll() {
        List<Weight> listWeight = weightService.getAll();
        return ResponseEntity.status(HttpStatus.OK).body(MessageReponse.builder()
                .message("lay du lieu thanh con")
                .data(listWeight)
                .status(HttpStatus.OK.value())
                .build());
    }
    @PreAuthorize("hasAuthority('CREATE_WEIGHT')")
    @PostMapping
    public ResponseEntity<MessageReponse> createWeight(@Valid @RequestBody WeightDTO weightDTO, BindingResult result) {
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
        Weight newWeight = weightService.createWeight(weightDTO);
        return ResponseEntity.ok(MessageReponse.builder()
                .message("Them thanh cong")
                .status(HttpStatus.OK.value())
                .data(newWeight)
                .build());
    }

    @PreAuthorize("hasAuthority('UPDATE_WEIGHT')")
    @PutMapping("/{id}")
    public ResponseEntity<MessageReponse> updateWeight(
            @PathVariable("id") Integer id,
            @RequestBody WeightDTO weightDTO
    )throws Exception{
        Weight newWeight = weightService.updateWeight(id,weightDTO);
        return ResponseEntity.ok(MessageReponse.builder()
                .message("sua thanh cong")
                .status(HttpStatus.OK.value())
                .data(newWeight)
                .build());
    }
}
