package com.example.demo.controller;
import com.example.demo.dto.CustomerDTO;
import com.example.demo.entity.Customer;
import com.example.demo.entity.Notice;
import com.example.demo.response.CustomerResponse;
import com.example.demo.response.MessageReponse;
import com.example.demo.service.impl.CustomerServiceImpl;
import com.example.demo.service.impl.NoticeServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("${api.prefix}/customer")
@RequiredArgsConstructor
public class CustomerController {
    private final CustomerServiceImpl customerService;
    private final NoticeServiceImpl noticeService;


    @GetMapping("/getAll")
    public ResponseEntity<MessageReponse> getAll(
            @RequestParam(name = "page", defaultValue = "1")int page,
            @RequestParam(name = "size", defaultValue = "10")int size
    ){
        Pageable pageable = PageRequest.of(page-1, size);
        Page<Customer> customerList = customerService.getALl(pageable);
        return ResponseEntity.ok().body(MessageReponse.builder()
                .message("get info successfuly")
                .status(HttpStatus.OK.value())
                .data(customerList)
                .build()
        );
    }

    @PostMapping("/register")
    public ResponseEntity<MessageReponse> add(
            @Validated
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
                CustomerResponse newCustomer =customerService.add(customer);
                noticeService.create(new Notice(null,"New customer hihi", "new customer just register account", "/admin/customer", 0));
                return ResponseEntity.status(HttpStatus.CREATED).body(MessageReponse.builder()
                        .message("them thanh cong")
                        .status(HttpStatus.OK.value())
                        .data(newCustomer)
                        .build()
                );
            }
    }
    @PreAuthorize("hasAuthority('UPDATE_CUSTOMER')")
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
    @PreAuthorize("hasAuthority('DELETE_CUSTOMER')")
    @DeleteMapping("{id}")
    public ResponseEntity<?> delete(@PathVariable("id") Integer id)throws Exception{
        customerService.delete(id);
        return ResponseEntity.ok().body(MessageReponse.builder()
                .message("xoa khach hang voi id = " + id +"thanh cong")
                .status(HttpStatus.OK.value())
                .build());
    }


    @GetMapping("{id}")
    public ResponseEntity<?> getById(@PathVariable("id") Integer id)throws Exception{

        return ResponseEntity.ok().body(MessageReponse.builder()
                .data(customerService.getCustomerByID(id))
                .message("get hang voi id = " + id +"thanh cong")
                .status(HttpStatus.OK.value())
                .build());
    }

    @PreAuthorize("hasAuthority('DELETE_CUSTOMER')")
    @PutMapping("soft-delete/{id}")
    public ResponseEntity<?> softDelete(
            @PathVariable("id") Integer id) throws Exception {
        String mss = customerService.softDelete(id);
        return ResponseEntity.ok().body(MessageReponse.builder()
                .message("sua thanh cong")
                .status(HttpStatus.OK.value())
                .data(mss)
                .build()
        );

    }


}
