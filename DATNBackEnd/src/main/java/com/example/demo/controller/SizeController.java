package com.example.demo.controller;

import com.example.demo.dto.SizeDTO;
import com.example.demo.response.MessageReponse;
import com.example.demo.service.SizeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.prefix}/size")
@RequiredArgsConstructor
public class SizeController {
    private final SizeService sizeService;

    @GetMapping("")
    public ResponseEntity<MessageReponse> getAll(){
        List<Size> sizeList = sizeService.getAll();
        return ResponseEntity.status(HttpStatus.OK).body(MessageReponse.builder()
                .message("Lay thong tin thanh cong")
                .status(HttpStatus.OK.value())
                .data(sizeList)
                .build());
    }

    @PostMapping("")
    public ResponseEntity<MessageReponse> add(@Valid @RequestBody SizeDTO sizeDTO, BindingResult result){
        if(result.hasErrors()){
            List<String> errorMessage = result.getFieldErrors()
                    .stream()
                    .map(FieldError::getDefaultMessage)
                    .toList();
            return ResponseEntity.badRequest().body(MessageReponse.builder()
                    .message(errorMessage.toString())
                    .status(HttpStatus.BAD_REQUEST.value())
                    .build());
        }
        Size newSize = sizeService.add(sizeDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(MessageReponse.builder()
                .message("Create size successfully")
                .status(HttpStatus.CREATED.value())
                .data(newSize)
                .build());
    }

    @PutMapping("{id}")
    public ResponseEntity<?> update(
            @PathVariable("id") Integer id,
            @RequestBody SizeDTO sizeDTO) throws Exception{
        sizeService.update(id, sizeDTO);
        return ResponseEntity.status(HttpStatus.OK).body(MessageReponse.builder()
                .message("Update Successfully")
                .status(HttpStatus.OK.value())
                .data(sizeDTO)
                .build());
    }

    @DeleteMapping("{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) throws Exception{
        sizeService.deleteSize(id);
        return ResponseEntity.status(HttpStatus.OK).body(MessageReponse.builder()
                .message("Delete size with id = " + id + " successfully")
                .status(HttpStatus.OK.value())
                .build());
    }
}
