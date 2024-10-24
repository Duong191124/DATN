package com.example.demo.controller;

import com.example.demo.dto.ColorDTO;
import com.example.demo.dto.SizeDTO;
import com.example.demo.entity.Color;
import com.example.demo.entity.Size;
import com.example.demo.response.MessageReponse;
import com.example.demo.service.ColorService;
import com.example.demo.service.impl.ColorServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.prefix}/color")
@RequiredArgsConstructor
public class ColorController {

    private final ColorServiceImpl colorService;

    @GetMapping("")
    public ResponseEntity<MessageReponse> getAll() {
        List<Color> colorList = colorService.getAll();
        return ResponseEntity.status(HttpStatus.OK).body(MessageReponse.builder()
                .message("Lay thong tin thanh cong")
                .status(HttpStatus.OK.value())
                .data(colorList)
                .build());
    }

//    @PostMapping("")
//    public ResponseEntity<MessageReponse> add(@Valid @RequestBody ColorDTO colorDTO, BindingResult result){
//        if(result.hasErrors()){
//            List<String> errorMessage = result.getFieldErrors()
//                    .stream()
//                    .map(FieldError::getDefaultMessage)
//                    .toList();
//            return ResponseEntity.badRequest().body(MessageReponse.builder()
//                    .message(errorMessage.toString())
//                    .status(HttpStatus.BAD_REQUEST.value())
//                    .build());
//        }
//        Color newColor = colorService.add(colorDTO);
//        return ResponseEntity.status(HttpStatus.CREATED).body(MessageReponse.builder()
//                .message("Create color successfully")
//                .status(HttpStatus.CREATED.value())
//                .data(newColor)
//                .build());
//    }


    @PostMapping("")
    public ResponseEntity<MessageReponse> add(@Valid @RequestBody ColorDTO colorDTO, BindingResult result) {
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
        Color newColor = colorService.add(colorDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(MessageReponse.builder()
                .message("Create size successfully")
                .status(HttpStatus.CREATED.value())
                .data(newColor)
                .build());
    }

    @PutMapping("{id}")
    public ResponseEntity<?> update(
            @PathVariable("id") Integer id,
            @RequestBody ColorDTO colorDTO) throws Exception {
        colorService.update(id, colorDTO);
        return ResponseEntity.status(HttpStatus.OK).body(MessageReponse.builder()
                .message("Update Successfully")
                .status(HttpStatus.OK.value())
                .data(colorDTO)
                .build());
    }



    @GetMapping("/{id}")
    public ResponseEntity<?> sizeFindById(@PathVariable Integer id) {
        try {
            Color color = colorService.findById(id);
            return ResponseEntity.ok(new MessageReponse("find color success", 200, color));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
