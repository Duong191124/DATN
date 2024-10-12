package com.example.demo.controller;

import com.example.demo.dto.BrandDTO;
import com.example.demo.entity.Brand;
import com.example.demo.response.MessageReponse;
import com.example.demo.service.BrandService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.prefix}/brand")
@RequiredArgsConstructor
public class BrandController {

    private final BrandService brandService;

    private final MessageSource messageSource;

    @GetMapping("")
    public ResponseEntity<MessageReponse> getAll(){
        List<Brand> brandList = brandService.getAll();
        return ResponseEntity.status(HttpStatus.OK).body(MessageReponse.builder()
                .message("Lay thong tin thanh cong")
                .status(HttpStatus.OK.value())
                .data(brandList)
                .build());
    }

    @PostMapping("")
    public ResponseEntity<MessageReponse> add(@Valid @RequestBody BrandDTO brandDTO, BindingResult result){
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
        Brand newBrand = brandService.add(brandDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(MessageReponse.builder()
                .message("create category success")
                .status(HttpStatus.CREATED.value())
                .data(newBrand)
                .build());
    }

    @PutMapping("{id}")
    public ResponseEntity<?> update(
            @PathVariable("id") Integer id,
            @RequestBody BrandDTO brandDTO) throws Exception{
        brandService.update(id, brandDTO);
        return ResponseEntity.status(HttpStatus.OK).body(MessageReponse.builder()
                .message("update brand success")
                .status(HttpStatus.OK.value())
                .data(brandDTO)
                .build());
    }

    @DeleteMapping("{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) throws Exception{
        brandService.deleteBrand(id);
        return ResponseEntity.status(HttpStatus.OK).body(MessageReponse.builder()
                .message("delete brand success")
                .status(HttpStatus.OK.value())
                .build());
    }
}
