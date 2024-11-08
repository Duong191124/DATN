package com.example.demo.controller;

import com.example.demo.dto.OrderDTO;
import com.example.demo.entity.OrderStatus;
import com.example.demo.request.OrderDetailRequest;
import com.example.demo.response.MessageReponse;
import com.example.demo.response.OrderPageResponse;
import com.example.demo.response.OrderResponse;
import com.example.demo.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("${api.prefix}/orders")
@RequiredArgsConstructor
public class  OrderController {
    private final OrderService orderService;
    @GetMapping("/list")
    public ResponseEntity<?> getAllOrders(){
        List<OrderResponse> lstOrderResponses = orderService.getAll();
        if(lstOrderResponses.isEmpty()){
            return ResponseEntity.ok(new MessageReponse("failed",400,null));
        }
        else {
            return ResponseEntity.ok(new MessageReponse("success",200,lstOrderResponses));
        }
    }
    @GetMapping("/pending")
        public ResponseEntity<?> getPendingOrdersByStaff(@RequestParam Integer staffId) {
        List<OrderResponse> pendingOrders = orderService.getPendingOrdersByStaff(staffId);
        return ResponseEntity.ok(new MessageReponse("successful",200,pendingOrders));
    }
    @GetMapping("/get-page")
    public ResponseEntity<OrderPageResponse> getOrdersByKeyword(
            @RequestParam(required = false) String staffName,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate endDate,
            @RequestParam(required = false) OrderStatus orderStatus,
            @RequestParam(defaultValue = "", required = false) String orderCode,
            @RequestParam(defaultValue = "0", required = false) int page,
            @RequestParam(defaultValue = "10", required = false) int limit
    ) {
        Pageable pageable = PageRequest.of(page, limit, Sort.by("orderDate").descending());
        Page<OrderResponse> orders = orderService.pageAll(staffName, startDate, endDate, orderStatus, orderCode, pageable);
        List<OrderResponse> orderResponses = orders.getContent();
        int totalPage = orders.getTotalPages();
        int pageCurrent = orders.getNumber();
        int pageSizeCurrent = orders.getSize();

        return ResponseEntity.ok(OrderPageResponse.builder()
                .orderResponseList(orderResponses)
                .page(pageCurrent)
                .pageSize(pageSizeCurrent)
                .totalPage(totalPage)
                .build());
    }


    @PostMapping("/add")
        public ResponseEntity<?> addOrder(@Valid @RequestBody OrderDTO orderDTO, BindingResult result){
            try {
                if(result.hasErrors()){
                    List<String> errorMessage = result.getFieldErrors().stream().map(FieldError::getDefaultMessage).toList();
                    return ResponseEntity.badRequest().body(errorMessage);
                }
                if(orderDTO == null){
                    ResponseEntity.ok(new MessageReponse("orderDto null",0,null));
                }
                OrderResponse OrderResponse = orderService.createdOrder(orderDTO);
                return ResponseEntity.status(HttpStatus.CREATED).body(new MessageReponse("order to added successfully",201,OrderResponse));
            }catch (Exception e){
               return ResponseEntity.badRequest().body(e.getMessage());
            }
        }
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateOrder(@PathVariable int id, @Valid @RequestBody OrderDTO orderDTO,BindingResult result){
        try {
            if(result.hasErrors()){
                List<String> errorMessage = result.getFieldErrors().stream().map(FieldError::getDefaultMessage).toList();
                return ResponseEntity.badRequest().body(errorMessage);
            }
            if(orderDTO == null){
                ResponseEntity.ok(new MessageReponse("orderDto null",400,null));
            }
            OrderResponse OrderResponse = orderService.updatedOrder(id,orderDTO);
            return ResponseEntity.ok(new MessageReponse("updated to ordered successfully",201,OrderResponse));
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @PutMapping("/update-productDetail/{id}")
    public ResponseEntity<?> updateOrderWithProductDetail(
            @PathVariable int id,
            @RequestBody List<OrderDetailRequest> orderDetailRequests) {
        try {
            OrderResponse orderResponse = orderService.updatedOrderWithProductDetail(id, orderDetailRequests);
            return ResponseEntity.ok(new MessageReponse("Updated order successfully", 201, orderResponse));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("update-status/{id}")
    public ResponseEntity<?> updateOrder(@PathVariable int id, @RequestBody Map<String, String> payload){
        String status = payload.get("status");
        try {
            OrderResponse OrderResponse = orderService.updateStatusOrder(id,status);
            return ResponseEntity.ok(new MessageReponse("updated to ordered successfully",200,OrderResponse));
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteOrder(@RequestParam int id){
        OrderResponse orderDTO = orderService.findById(id);
        try {
            if (id > orderDTO.getId()){
                return ResponseEntity.ok("not valid");
            }
            else {
                orderService.deletedOrder(id);
                return ResponseEntity.ok(new MessageReponse("deleted to Ordered successfully",200,null));
            }
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @GetMapping("/find")
    public ResponseEntity<?> findByIdOrder(@RequestParam String code){
        try {
            OrderResponse orderDTOFind = orderService.findByCode(code);
            return ResponseEntity.ok(new MessageReponse("found success",200,orderDTOFind));
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
