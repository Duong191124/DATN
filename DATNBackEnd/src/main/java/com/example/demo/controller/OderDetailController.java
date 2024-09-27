package com.example.demo.controller;

import com.example.demo.dto.OrderDetailDTO;
import com.example.demo.entity.OrderDetail;
import com.example.demo.response.MessageReponse;
import com.example.demo.service.impl.OrderDetailServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.prefix}/order_detail")
@RequiredArgsConstructor
public class OderDetailController {
    private final OrderDetailServiceImpl orderDetailService;
    @GetMapping
    public ResponseEntity<MessageReponse> getAll(){
        List<OrderDetail> orderDetailList = orderDetailService.getAll();
        return ResponseEntity.ok().body(MessageReponse.builder()
                .message("lay du lieu thanh cong")
                .status(HttpStatus.OK.value())
                .data(orderDetailList)
                .build());

    }

    @PostMapping
    public ResponseEntity<MessageReponse>add(@Valid @RequestBody OrderDetailDTO orderDetailDTO, BindingResult result){
        if (result.hasErrors()){
            List<String > errorMessage = result.getFieldErrors()
                    .stream()
                    .map(FieldError::getDefaultMessage)
                    .toList();
            return ResponseEntity.badRequest().body(MessageReponse.builder()
                    .message(errorMessage.toString())
                    .status(HttpStatus.BAD_REQUEST.value())
                    .build());
        }
        OrderDetail orderDetail = orderDetailService.add(orderDetailDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(MessageReponse.builder()
                .message("them thanh cong")
                .status(HttpStatus.CREATED.value())
                .data(orderDetail)
                .build());
    }

    @PutMapping("{id}")
    public ResponseEntity<?> update(@PathVariable("id") Integer id ,@RequestBody OrderDetailDTO orderDetailDTO)throws Exception{
        orderDetailService.update(id, orderDetailDTO);
        return ResponseEntity.ok().body(MessageReponse.builder()
                .message("sua thanh cong")
                .status(HttpStatus.OK.value())
                .data(orderDetailDTO)
                .build());

    }

    @DeleteMapping("{id}")
    public ResponseEntity<?> delete(@PathVariable("id") Integer id)throws Exception{
        orderDetailService.delete(id);
        return ResponseEntity.ok().body(MessageReponse.builder()
                .message("xoa thanh cong voi id =" +id)
                .status(HttpStatus.OK.value())
                .build());
    }
}
