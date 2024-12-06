package com.example.demo.controller;

import com.example.demo.dto.SizeDTO;
import com.example.demo.entity.Size;
import com.example.demo.response.MessageReponse;
import com.example.demo.service.impl.SizeServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("${api.prefix}/size")
@RequiredArgsConstructor
public class SizeController {
    private final SizeServiceImpl sizeService;

    @GetMapping("")
    public ResponseEntity<MessageReponse> getAll(){
        List<Size> sizeList = sizeService.getAll();
        return ResponseEntity.status(HttpStatus.OK).body(MessageReponse.builder()
                .message("Lay thong tin thanh cong")
                .status(HttpStatus.OK.value())
                .data(sizeList)
                .build());
    }


    @PostMapping("/check-duplicate")
    public ResponseEntity<Map<String, Boolean>> checkDuplicateSize(@RequestBody Map<String, String> request) {
        String type = request.get("type");
        String value = request.get("value");

        boolean exists = sizeService.isDuplicate(type, value);
        Map<String, Boolean> response = new HashMap<>();
        response.put("exists", exists);
        return ResponseEntity.ok(response);
    }
    @PreAuthorize("hasAuthority('CREATE_SIZE')")
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
    @PreAuthorize("hasAuthority('UPDATE_SIZE')")
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

    @GetMapping("/{id}")
    public ResponseEntity<?> sizeFindById(@PathVariable Integer id){
        try {
            Size size = sizeService.findById(id);
            return ResponseEntity.ok(new MessageReponse("find size success",200,size));
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
