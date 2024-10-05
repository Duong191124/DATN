package com.example.demo.controller;

import com.example.demo.dto.StaffDTO;
import com.example.demo.entity.Staff;
import com.example.demo.response.MessageReponse;
import com.example.demo.response.StaffResponse;
import com.example.demo.service.impl.StaffServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.prefix}/staff")
@RequiredArgsConstructor
public class StaffController {
    private final StaffServiceImpl staffService;

    @GetMapping("/getAll")
    public ResponseEntity<MessageReponse> getAll(
            @RequestParam(name = "page", defaultValue = "1")int page,
            @RequestParam(name = "size", defaultValue = "10")int size
    ){
        Pageable pageable = PageRequest.of(page-1, size);
        List<StaffResponse> staffList = staffService.getAll(pageable)
                .stream()
                .map(StaffResponse::fromStaffResponse)
                .toList();
        return ResponseEntity.ok().body(MessageReponse.builder()
                .message("lay thong tin thanh cong")
                .status(HttpStatus.OK.value())
                .data(staffList)
                .build()
        );
    }

    @PostMapping("/register")
    public ResponseEntity<MessageReponse> createStaff(
            @RequestBody StaffDTO staffDTO,
            BindingResult result
    ){
        if(result.hasErrors()){
            List<String> errorMessage = result.getFieldErrors()
                    .stream()
                    .map(FieldError::getDefaultMessage)
                    .toList();
            return ResponseEntity.badRequest().body(MessageReponse.builder()
                    .message(errorMessage.toString())
                    .status(HttpStatus.BAD_REQUEST.value())
                    .build()
            );
        }
        try{
            Staff newStaff = staffService.save(staffDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(MessageReponse.builder()
                    .message("register succesfuly")
                    .status(HttpStatus.OK.value())
                    .data(newStaff)
                    .build()
            );
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body(MessageReponse.builder()
                    .data(null)
                    .message(e.getMessage())
                    .status(HttpStatus.NOT_ACCEPTABLE.value())
                    .build());
        }

    }

    @DeleteMapping("{id}")
    public ResponseEntity<?> delete(@PathVariable("id") Integer id)throws Exception{
        staffService.deleteById(id);
        return ResponseEntity.ok().body(MessageReponse.builder()
                .message("xoa staff voi id = " + id +"thanh cong")
                .status(HttpStatus.OK.value())
                .build());
    }
    @GetMapping("/{id}")
    public ResponseEntity<MessageReponse> getById(@PathVariable("id")int id){
        try{
            return ResponseEntity.ok().body(
                    MessageReponse.builder()
                            .data(staffService.getById(id))
                            .status(HttpStatus.OK.value())
                            .message("get staff by id successfully")
                            .build()
            );
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    MessageReponse.builder()
                            .status(HttpStatus.BAD_REQUEST.value())
                            .message(e.getMessage())
                            .data(null)
                            .build()
            );
        }
    }
}
