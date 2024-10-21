package com.example.demo.controller;

import com.example.demo.dto.CustomerDTO;
import com.example.demo.response.CustomerResponse;
import com.example.demo.response.MessageReponse;
import com.example.demo.service.impl.CustomerServiceImpl;
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
@RequestMapping("${api.prefix}/customer")
@RequiredArgsConstructor
public class CustomerController {
    private final CustomerServiceImpl customerService;

    @GetMapping("/getAll")
    public ResponseEntity<MessageReponse> getAll(
            @RequestParam(name = "page", defaultValue = "1")int page,
            @RequestParam(name = "size", defaultValue = "10")int size
    ){
        Pageable pageable = PageRequest.of(page-1, size);
        return ResponseEntity.ok().body(MessageReponse.builder()
                .message("get info successfuly")
                .status(HttpStatus.OK.value())
                .data(customerService.getALl(pageable))
                .build()
        );
    }

    @PostMapping("/register")
    public ResponseEntity<MessageReponse> add(
            @RequestBody CustomerDTO customer,
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
                CustomerResponse newCustomer =customerService.add(customer);
                return ResponseEntity.status(HttpStatus.CREATED).body(MessageReponse.builder()
                        .message("them thanh cong")
                        .status(HttpStatus.OK.value())
                        .data(newCustomer)
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

    @PutMapping("{id}")
    public ResponseEntity<?> update(
            @PathVariable("id") Integer id,
            @RequestBody CustomerDTO customerDTO)throws Exception{
        CustomerResponse update = customerService.update(id,customerDTO);
        return ResponseEntity.ok().body(MessageReponse.builder()
                .message("sua thanh cong")
                .status(HttpStatus.OK.value())
                .data(update)
                .build()
        );

    }
    @DeleteMapping("{id}")
    public ResponseEntity<?> delete(@PathVariable("id") Integer id)throws Exception{
        customerService.delete(id);
        return ResponseEntity.ok().body(MessageReponse.builder()
                .message("xoa khach hang voi id = " + id +"thanh cong")
                .status(HttpStatus.OK.value())
                .build());
    }


}
