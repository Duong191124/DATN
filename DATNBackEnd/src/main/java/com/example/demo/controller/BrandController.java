package com.example.demo.controller;

import com.example.demo.dto.BrandDTO;
import com.example.demo.entity.Brand;
import com.example.demo.response.MessageReponse;
import com.example.demo.service.BrandService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
    public ResponseEntity<MessageReponse> getAll() {
        List<Brand> brandList = brandService.getAll();
        return ResponseEntity.status(HttpStatus.OK).body(MessageReponse.builder()
                .message("Lay thong tin thanh cong")
                .status(HttpStatus.OK.value())
                .data(brandList)
                .build());
    }
    @PreAuthorize("hasAuthority('CREATE_BRAND')")
    @PostMapping("")
    public ResponseEntity<MessageReponse> add(@Valid @RequestBody BrandDTO brandDTO, BindingResult result) {
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
        Brand newBrand = brandService.add(brandDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(MessageReponse.builder()
                .message("create category success")
                .status(HttpStatus.CREATED.value())
                .data(newBrand)
                .build());
    }
    @PreAuthorize("hasAuthority('UPDATE_BRAND')")
    @PutMapping("{id}")
    public ResponseEntity<?> update(
            @PathVariable("id") Integer id,
            @RequestBody BrandDTO brandDTO) throws Exception {
        brandService.update(id, brandDTO);
        return ResponseEntity.status(HttpStatus.OK).body(MessageReponse.builder()
                .message("update brand success")
                .status(HttpStatus.OK.value())
                .data(brandDTO)
                .build());
    }


//    @GetMapping("/checkForeignKey/{id}")
//    public ResponseEntity<String> checkForeignKey(@PathVariable("id") Integer id) {
//        boolean candelete = brandService.candeleteBrand(id);
//        if (candelete) {
//            return ResponseEntity.ok("can delete");
//        } else {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Cannot delete, foreign key constraint.");
//        }
//    }
    @PreAuthorize("hasAuthority('DELETE_BRAND')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBrand(@PathVariable("id") Integer id) {
        try {
            brandService.deleteBrand(id);
            return ResponseEntity.status(HttpStatus.OK).body(MessageReponse.builder()
                    .message("delete brand successfully")
                    .status(HttpStatus.OK.value())
                    .build());

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());

        }
    }

}
