package com.example.demo.controller;

import com.example.demo.dto.PromotionDTO;
import com.example.demo.entity.Promotion;
import com.example.demo.response.MessageReponse;
import com.example.demo.response.PromotionResponse;
import com.example.demo.service.PromotionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.prefix}/promotion")
@RequiredArgsConstructor
public class PromotionController {

    private final PromotionService promotionService;

    @GetMapping("")
    public ResponseEntity<?> getAll(){
        List<PromotionResponse> promotionList = promotionService.getAll().stream().map(PromotionResponse::fromPromotionResponse).toList();
        return ResponseEntity.status(HttpStatus.OK).body(MessageReponse.builder()
                .message("Lay thong tin thanh cong")
                .status(HttpStatus.OK.value())
                .data(promotionList)
                .build());
    }

    @PostMapping("")
    public ResponseEntity<MessageReponse> add(@Valid @RequestBody PromotionDTO promotionDTO, BindingResult result){
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
        PromotionResponse newPromotion = promotionService.add(promotionDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(MessageReponse.builder()
                .message("Create promotion successfully")
                .status(HttpStatus.CREATED.value())
                .data(newPromotion)
                .build());
    }

    @PutMapping("{id}")
    public ResponseEntity<?> update(
            @PathVariable("id") Integer id,
            @RequestBody @Valid PromotionDTO promotionDTO,
            BindingResult result) throws Exception{
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
        PromotionResponse updatePromotion = promotionService.update(id, promotionDTO);
        return ResponseEntity.status(HttpStatus.OK).body(MessageReponse.builder()
                .message("Update Successfully")
                .status(HttpStatus.OK.value())
                .data(updatePromotion)
                .build());
    }

    @DeleteMapping("{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) throws Exception{
        promotionService.deletePromotion(id);
        return ResponseEntity.status(HttpStatus.OK).body(MessageReponse.builder()
                .message("Delete promotion with id = " + id + " successfully")
                .status(HttpStatus.OK.value())
                .build());
    }

}
