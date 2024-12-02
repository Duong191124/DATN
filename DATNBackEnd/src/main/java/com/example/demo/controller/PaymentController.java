package com.example.demo.controller;

import com.example.demo.config.VNPayConfig;
import com.example.demo.dto.PaymentDTO;
import com.example.demo.entity.*;
import com.example.demo.repository.OrderRepo;
import com.example.demo.repository.PaymentRepo;
import com.example.demo.repository.ProductDetailRepo;
import com.example.demo.response.MessageReponse;
import com.example.demo.response.PaymentResponse;
import com.example.demo.service.OrderService;
import com.example.demo.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;

@RestController
@RequestMapping("${api.prefix}/payments")
public class PaymentController {
    @Autowired
    PaymentService paymentService;
    @Autowired
    OrderService orderService;
    @Autowired
    PaymentRepo paymentRepo;
    @Autowired
    OrderRepo orderRepo;
    @Autowired
    ProductDetailRepo productDetailRepo;

    @GetMapping("list")
    public ResponseEntity<?> getAllPayment(){
        List<PaymentResponse> paymentResponses = paymentService.getAll();
        if(paymentResponses.isEmpty()){
            return ResponseEntity.ok(new MessageReponse("failed",400,null));
        }
        return ResponseEntity.ok(new MessageReponse("success",200,paymentResponses)) ;
    }
    @PreAuthorize("hasAuthority('CREATE_PAYMENT')")
    @PostMapping("/add")
    public ResponseEntity<?> addPayment(@Valid @RequestBody PaymentDTO paymentDTO, BindingResult result){
        try {
            if(result.hasErrors()){
                List<String> messageError = result.getFieldErrors().stream().map(FieldError::getDefaultMessage).toList();
                return ResponseEntity.badRequest().body(messageError);
            }
            PaymentResponse paymentResponse = paymentService.createdPayment(paymentDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(new MessageReponse("added successfully",201,paymentResponse));
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @PreAuthorize("hasAuthority('UPDATE_PAYMENT')")
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updatePayment(@PathVariable int id,@Valid @RequestBody PaymentDTO paymentDTO,BindingResult result){

        try {
            if(result.hasErrors()){
                List<String> messageError = result.getFieldErrors().stream().map(FieldError::getDefaultMessage).toList();
                return ResponseEntity.badRequest().body(messageError);
            }
            PaymentResponse paymentResponse = paymentService.updatedPayment(id,paymentDTO);
            return ResponseEntity.ok(new MessageReponse("updated successfully",200,paymentResponse));
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @PreAuthorize("hasAuthority('DELETE_PAYMENT')")
    @DeleteMapping("/delete")
    public ResponseEntity<?> deletePayment(@RequestParam int id){
        try {
            paymentService.deletedPayment(id);
            return ResponseEntity.ok(new MessageReponse("deleted successfully",200,null));
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/findById")
    public ResponseEntity<?> findById(@RequestParam int id){
        try {
            PaymentResponse paymentFind = paymentService.findById(id);
            if (paymentFind == null) {
                return ResponseEntity.ok(new MessageReponse("Payment not found",400 , null));
            }
            return ResponseEntity.ok(new MessageReponse("Payment found successfully",200 , paymentFind));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageReponse("Error occurred: " + e.getMessage(), 400, null));
        }
    }

    @GetMapping("/payment-callback")
    public ResponseEntity<Map<String, String>> paymentCallback(@RequestParam Map<String, String> params) {
        Integer orderId = Integer.valueOf(params.get("vnp_TxnRef"));
        String vnp_SecureHash = params.get("vnp_SecureHash");

        String calculatedHash = generateSecureHash(params);
        Orders order = orderRepo.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));
        if (vnp_SecureHash.equals(calculatedHash)) {
            String paymentStatus = params.get("vnp_ResponseCode");
                    if ("00".equals(paymentStatus)) {
                        // Cập nhật trạng thái thanh toán thành công
                        order.setStatus(OrderStatus.completed);
                        orderRepo.save(order);
                        Payment payment = new Payment();
                        payment.setPaymentMethod("VNP");
                        payment.setPaymentDate(new Date());
                        payment.setOrders(order);
                        paymentRepo.save(payment);
                        Map<String, String> response = new HashMap<>();
                        response.put("status", "SUCCESS");
                        response.put("message", "Thanh toán thành công");
                        response.put("orderId", order.getCode()); // Trả về orderId
                        return ResponseEntity.ok(response);
                    } else {
                            // Duyệt qua các chi tiết đơn hàng để cập nhật số lượng sản phẩm
                        Iterator<OrderDetail> iterator = order.getOrderDetails().iterator();
                        while (iterator.hasNext()) {
                            OrderDetail orderDetail = iterator.next();
                            ProductDetail productDetail = orderDetail.getProductDetail();
                            int quantityOrdered = orderDetail.getQuantity();

                            // Cập nhật lại số lượng sản phẩm trong kho (tăng lại số lượng)
                            productDetail.setQuantity(productDetail.getQuantity() + quantityOrdered);
                            productDetailRepo.save(productDetail);  // Lưu sản phẩm sau khi cập nhật

                            // Xóa OrderDetail khỏi Order
                            iterator.remove();  // Xóa OrderDetail khỏi danh sách
                        }
                        order.setTotalAmount(0.0);
// Lưu lại Order sau khi đã xóa OrderDetails
                        orderRepo.save(order);

                        return ResponseEntity.ok(Map.of("status", "FAILED", "message", "Thanh toán thất bại"));
                    }
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("status", "INVALID", "message", "Mã bảo mật không hợp lệ"));
        }
    }
    private String generateSecureHash(Map<String, String> params) {
        List<String> fieldNames = new ArrayList<>(params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();

        for (String fieldName : fieldNames) {
            String fieldValue = params.get(fieldName);
            if (fieldValue != null && fieldValue.length() > 0 && !fieldName.equals("vnp_SecureHash")) {
                hashData.append(fieldName).append('=').append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
                hashData.append('&');
            }
        }

        // Xóa ký tự '&' cuối cùng nếu có
        if (hashData.length() > 0) {
            hashData.deleteCharAt(hashData.length() - 1);
        }

        // Thêm secret key vào cuối chuỗi hash
        return VNPayConfig.hmacSHA512(VNPayConfig.secretKey, hashData.toString());
    }

}
