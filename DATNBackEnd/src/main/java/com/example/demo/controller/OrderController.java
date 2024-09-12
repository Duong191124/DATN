package com.example.demo.controller;

import com.example.demo.dto.OrderDTO;
import com.example.demo.response.ApiResponse;
import com.example.demo.response.MessageReponse;
import com.example.demo.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;
    @GetMapping("/list")
    public ResponseEntity<MessageReponse> getAllOrders(){
        List<OrderDTO> lstOrderDTO = orderService.getAll();
        if(lstOrderDTO.isEmpty()){
            return ResponseEntity.ok(new MessageReponse("failed",0,null));
        }
        else {
            return ResponseEntity.ok(new MessageReponse("success",1,lstOrderDTO));
        }
    }
    @PostMapping("/add")
    public ResponseEntity<MessageReponse> addOrder(@Valid @ModelAttribute OrderDTO orderDTO){
        try {
            OrderDTO orderDTOAdd = orderService.createdOrder(orderDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(new MessageReponse("order to added successfully",1,orderDTOAdd));
        }
        catch (Exception e){
            return ResponseEntity.badRequest().body(new MessageReponse(e.getMessage(),0,null));
        }
    }
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateOrder(@PathVariable int id, @Valid @ModelAttribute OrderDTO orderDTO, BindingResult result){
        try {
            if(result.hasErrors()){
                List<String> message =result.getFieldErrors().stream().map(FieldError::getDefaultMessage).toList();
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(message);
            }
            OrderDTO orderDTOUpdate = orderService.updatedOrder(id,orderDTO);
            return ResponseEntity.ok(new MessageReponse("updated to ordered successfully",1,orderDTOUpdate));
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageReponse(e.getMessage(),0,null));
        }
    }
    @DeleteMapping("/delete")
    public ResponseEntity<MessageReponse> deleteOrder(@RequestParam Integer id){
        try {
            orderService.deletedOrder(id);
            return ResponseEntity.ok(new MessageReponse("deleted to Ordered successfully",1,null));
        }
        catch (Exception e){
            return ResponseEntity.ok(new MessageReponse(e.getMessage(),0,null));
        }
    }
    @GetMapping("/find")
    public ResponseEntity<MessageReponse> findByIdOrder(@RequestParam int id){
        try {
            OrderDTO orderDTOFind = orderService.findById(id);
            return ResponseEntity.ok(new MessageReponse("found success",1,orderDTOFind));
        }catch (Exception e){
            return ResponseEntity.ok(new MessageReponse("error:"+e.getMessage(),0,null));
        }
    }






}
