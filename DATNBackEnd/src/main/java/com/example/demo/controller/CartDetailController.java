package com.example.demo.controller;

import com.example.demo.dto.CartDetailDTO;
import com.example.demo.entity.CartDetail;
import com.example.demo.response.MessageReponse;
import com.example.demo.service.CartDetailService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/cartDetail")
@RequiredArgsConstructor
public class CartDetailController {
    private final CartDetailService cartDetailService;

    @GetMapping
    public ResponseEntity<MessageReponse> getAll(){
        List<CartDetail> cartDetailList = cartDetailService.getAll();
        return ResponseEntity.ok().body(MessageReponse.builder()
                .message("lay du lieu thanh cong")
                .status(HttpStatus.OK.value())
                .data(cartDetailList)
                .build());
    }

    @PostMapping
    public ResponseEntity<MessageReponse> add(
            @Valid @RequestBody CartDetailDTO cartDetailDTO,
            BindingResult result){
        if (result.hasErrors()){
            List<String> errorMessage = result.getFieldErrors()
                    .stream()
                    .map(FieldError::getDefaultMessage)
                    .toList();
            return ResponseEntity.badRequest().body(MessageReponse.builder()
                    .message(errorMessage.toString())
                    .status(HttpStatus.BAD_REQUEST.value())
                    .build());
        }
        CartDetail cartDetail = cartDetailService.add(cartDetailDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(MessageReponse.builder()
                .message("them thanh cong")
                .status(HttpStatus.CREATED.value())
                .data(cartDetail)
                .build());

    }

    @PutMapping
    public ResponseEntity<?> update(
            @PathVariable("id") Integer id,
            @RequestBody CartDetailDTO cartDetailDTO
    )throws Exception{
        cartDetailService.update(id,cartDetailDTO);
        return ResponseEntity.ok().body(MessageReponse.builder()
                .message("sua thanh cong")
                .status(HttpStatus.OK.value())
                .data(cartDetailDTO)
                .build());
    }

    @DeleteMapping
    public ResponseEntity<?> delete(@PathVariable("id") Integer id)throws Exception{
        cartDetailService.delete(id);
        return ResponseEntity.ok().body(MessageReponse.builder()
                .message("xoa thanh cong voi id ="+id)
                .status(HttpStatus.OK.value())
                .build());
    }
}
