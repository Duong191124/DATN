package com.example.demo.controller;

import com.example.demo.dto.OrderBuyerResponseDTO;
import com.example.demo.dto.OrderDTO;
import com.example.demo.dto.OrderOnlineDTO;
import com.example.demo.entity.Notice;
import com.example.demo.entity.OrderStatus;
import com.example.demo.request.OrderWithVoucherAndOrderDetailRequest;
import com.example.demo.response.MessageReponse;
import com.example.demo.response.OrderPageResponse;
import com.example.demo.response.OrderResponse;
import com.example.demo.service.impl.NoticeServiceImpl;
import com.example.demo.service.impl.OrderServiceImpl;
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
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("${api.prefix}/orders")
@RequiredArgsConstructor
public class  OrderController {
    private final OrderServiceImpl orderService;
    private final NoticeServiceImpl noticeService;
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
        Pageable pageable = PageRequest.of(page, limit, Sort.by("createdAt").descending());
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

    @GetMapping("/{customerId}/getDataByCustomer")
    public ResponseEntity<?> getOrderByCustomerId (
            @PathVariable Integer customerId,
            @RequestParam(required = false) OrderStatus orderStatus,
            @RequestParam(defaultValue = "0", required = false) int page,
            @RequestParam(defaultValue = "10", required = false) int limit
    ) {
        Pageable pageable = PageRequest.of(page, limit, Sort.by("createdAt").descending());
        Page<OrderBuyerResponseDTO> orders = orderService.getOrderByCustomerId(customerId, pageable, orderStatus);

        return ResponseEntity.ok().body(MessageReponse.builder()
                        .data(orders)
                        .message("successful")
                        .status(HttpStatus.OK.value())
                        .build());
    }

    @GetMapping("/{customerId}/getDataOrderByOrderId/{orderId}")
    public ResponseEntity<?> getOrderByOrderId (
            @PathVariable("customerId") Integer customerId,
            @PathVariable("orderId") Integer orderId,
            @RequestParam(required = false) OrderStatus status
    ){
        List<OrderBuyerResponseDTO> orderList = orderService.getAllOrderByOrderId(customerId, status, orderId);
        return ResponseEntity.ok().body(MessageReponse.builder()
                        .data(orderList)
                        .message("successful")
                        .status(HttpStatus.OK.value())
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
                noticeService.create(new Notice(null,"New order", "new order id: " + OrderResponse.getId(), "/admin/order", 0));
                return ResponseEntity.status(HttpStatus.CREATED).body(new MessageReponse("order to added successfully",201,OrderResponse));
            }catch (Exception e){
               return ResponseEntity.badRequest().body(e.getMessage());
            }
        }

    @PostMapping("/add-online")
    public ResponseEntity<?> createOrder(@RequestBody OrderOnlineDTO orderDTO) {
        try {
            // Try to create the order
            OrderResponse order = orderService.createOrderOnline(orderDTO);

            // Return a successful response
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new MessageReponse("Order added successfully", 201, order));

        } catch (Exception e) {
            // Log the error for debugging
            System.err.println("Error creating order: " + e.getMessage());

            // Return a structured error response
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "ORDER_CREATION_FAILED");
            errorResponse.put("message", e.getMessage());

            // Send the error message with HTTP 400 Bad Request or 500 Internal Server Error
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
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
            @PathVariable Integer id,
            @RequestBody OrderWithVoucherAndOrderDetailRequest orderUpdateRequest) {
        try {
            OrderResponse orderResponse = orderService.updatedOrderWithProductDetail(id, orderUpdateRequest);
            // Trả về phản hồi thành công
            return ResponseEntity.ok(new MessageReponse("Updated order successfully", 201, orderResponse));
        } catch (Exception e) {
            // Trả về lỗi nếu có sự cố
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }



    @PutMapping("update-status/{id}")
    public ResponseEntity<?> updateOrder(@PathVariable int id, @RequestBody Map<String, String> payload) {
        String status = payload.get("status");
        String note = payload.get("note");
        try {
            OrderResponse orderResponse = orderService.updateStatusOrder(id, status, note);
            return ResponseEntity.ok(new MessageReponse("updated to " + status + " successfully", 200, orderResponse));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new MessageReponse(e.getMessage(), 400, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageReponse("Error: " + e.getMessage(), 400, null));
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
    @GetMapping("/hasUsedVoucher/{customerId}/{voucherId}")
    public boolean hasCustomerUsedVoucher(@PathVariable int customerId, @PathVariable int voucherId) {
        return orderService.hasCustomerUsedVoucher(customerId, voucherId);
    }
    @PutMapping("/update-customer/{orderId}")
    public ResponseEntity<?> UpdateCustomerById(
            @PathVariable Integer orderId,
            @RequestBody Map<String, Integer> requestBody
    ) {
        try {
            Integer customerId = requestBody.get("customerId");
            OrderResponse updatedOrder = orderService.updateCustomerId(orderId, customerId);
            return ResponseEntity.ok(new MessageReponse("Customer updated successfully", 200, updatedOrder));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageReponse(e.getMessage(), 400, null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageReponse("Unexpected error occurred", 500, null));
        }
    }


}
