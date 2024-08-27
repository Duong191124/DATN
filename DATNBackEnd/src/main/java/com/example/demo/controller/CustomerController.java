package com.example.demo.controller;

import com.example.demo.dto.CustomerDTO;
import com.example.demo.entity.Customer;
import com.example.demo.response.MessageReponse;
import com.example.demo.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/customer")
@RequiredArgsConstructor
public class CustomerController {
    private final CustomerService customerService;

    @GetMapping
    public ResponseEntity<MessageReponse> getAll(){
        List<Customer> customerList = customerService.getALl();
        return ResponseEntity.ok().body(MessageReponse.builder()
                .message("lay thong tin thanh cong")
                .status(HttpStatus.OK.value())
                .data(customerList)
                .build()
        );
    }

    @PostMapping
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
            Customer newCustomer =customerService.add(customer);
            return ResponseEntity.status(HttpStatus.CREATED).body(MessageReponse.builder()
                    .message("them thanh cong")
                    .status(HttpStatus.OK.value())
                    .data(newCustomer)
                    .build()
            );

    }

    @PutMapping("{id}")
    public ResponseEntity<?> update(
            @PathVariable("id") Integer id,
            @RequestBody CustomerDTO customerDTO)throws Exception{
        customerService.update(id,customerDTO);
        return ResponseEntity.ok().body(MessageReponse.builder()
                .message("sua thanh cong")
                .status(HttpStatus.OK.value())
                .data(customerDTO)
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
