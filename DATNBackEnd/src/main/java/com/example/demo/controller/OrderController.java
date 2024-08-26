package com.example.demo.controller;

import com.example.demo.dto.OrderDTO;
import com.example.demo.repository.OrderRepo;
import com.example.demo.response.ApiResponse;
import com.example.demo.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;
    @GetMapping("/list")
    public ResponseEntity<ApiResponse<List<OrderDTO>>> getAllOrders(){
        List<OrderDTO> lstOrderDTO = orderService.getAll();
        if(lstOrderDTO.isEmpty()){
            return ResponseEntity.ok(new ApiResponse<>(false,"failed",null));
        }
        else {
            return ResponseEntity.ok(new ApiResponse<>(true,"success",lstOrderDTO));
        }
    }
    @PostMapping("/add")
    public ResponseEntity<ApiResponse<OrderDTO>> addOrder(@Valid @RequestBody OrderDTO orderDTO){
        if(orderDTO == null){
            ResponseEntity.ok(new ApiResponse<>(false,"orderDto null",null));
        }
        OrderDTO orderDTOAdd = orderService.createdOrder(orderDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse<>(true,"order to added successfully",orderDTOAdd));
    }
    @PutMapping("/update/{id}")
    public ResponseEntity<ApiResponse<OrderDTO>> updateOrder(@PathVariable int id, @Valid @RequestBody OrderDTO orderDTO){
        if(orderDTO == null){
            ResponseEntity.ok(new ApiResponse<>(false,"orderDto null",null));
        }
        OrderDTO orderDTOUpdate = orderService.updatedOrder(id,orderDTO);
        return ResponseEntity.ok(new ApiResponse<>(true,"updated to ordered successfully",orderDTOUpdate));
    }
    @DeleteMapping("/delete")
    public ResponseEntity deleteOrder(@RequestParam int id){
        OrderDTO orderDTO = orderService.findById(id);
        if (id > orderDTO.getId()){
            return ResponseEntity.ok("not valid");
        }
        else {
            orderService.deletedOrder(id);
            return ResponseEntity.ok(new ApiResponse<>(true,"deleted to Ordered successfully",null));
        }
    }
    @GetMapping("/find")
    public ResponseEntity<ApiResponse<OrderDTO>> findByIdOrder(@RequestParam int id){
        try {
            OrderDTO orderDTOFind = orderService.findById(id);
            return ResponseEntity.ok(new ApiResponse<>(true,"found success",orderDTOFind));
        }catch (Exception e){
            return ResponseEntity.ok(new ApiResponse<>(false,"error:"+e.getMessage(),null));
        }
    }
}
