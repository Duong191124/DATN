package com.example.demo.service.impl;

import com.example.demo.config.VNPayConfig;
import com.example.demo.dto.PaymentDTO;
import com.example.demo.entity.OrderStatus;
import com.example.demo.entity.Orders;
import com.example.demo.entity.Payment;
import com.example.demo.repository.OrderRepo;
import com.example.demo.repository.PaymentRepo;
import com.example.demo.response.PaymentResponse;
import com.example.demo.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class PaymentServiceIml implements PaymentService {
    @Autowired
    PaymentRepo paymentRepo;
    @Autowired
    OrderRepo orderRepo;
    @Override
    public List<PaymentResponse> getAll() {
        return paymentRepo.findAll().stream().map(PaymentResponse::convertPaymentResponse).toList();
    }

    @Override
    public PaymentResponse createdPayment(PaymentDTO paymentDTO) {
        try {
            Orders orders = orderRepo.findById(paymentDTO.getOrderId()).orElseThrow(()->new RuntimeException("not found order with id:"+paymentDTO.getOrderId()));
            String paymentUrl = null;
            if(!paymentDTO.getPaymentMethod().equalsIgnoreCase("ocd")){
                if(paymentDTO.getPaymentMethod().equalsIgnoreCase("vnp")){
                     paymentUrl = createPaymentUrl(orders.getId(), orders.getTotalAmount().longValue());
                }
                orders.setStatus(OrderStatus.shipped);
                orderRepo.save(orders);
            }
            // Tạo URL thanh toán VNPay
            paymentDTO.setOrderId(orders.getId());
            Payment payment = PaymentDTO.convertPayment(paymentDTO,orderRepo);
            payment.setPaymentMethod(paymentDTO.getPaymentMethod());
            payment.setPaymentDate(paymentDTO.getPaymentDate());
            payment.getOrders().setId(paymentDTO.getOrderId());
            paymentRepo.save(payment);
            return PaymentResponse.convertPaymentResponseUrl(payment,paymentUrl);
        }catch (Exception e){
            throw new RuntimeException("not found payment"+e.getMessage());
        }
    }
    private String createPaymentUrl(Integer uniqueId, long amount) throws UnsupportedEncodingException {
        String vnp_Version = "2.1.0";
        String vnp_Command = "pay";
        long amounts = amount*100;
        String orderType = "billpayment";
        Integer vnp_TxnRef = uniqueId;
        String vnp_IpAddr = "127.0.0.1";

        String vnp_TmnCode = VNPayConfig.vnp_TmnCode;

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", vnp_Version);
        vnp_Params.put("vnp_Command", vnp_Command);
        vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
        vnp_Params.put("vnp_Amount", String.valueOf(amounts));
        vnp_Params.put("vnp_CurrCode", "VND");

//        vnp_Params.put("vnp_BankCode", bankCode);
        vnp_Params.put("vnp_TxnRef", vnp_TxnRef.toString());
        vnp_Params.put("vnp_OrderInfo", "Thanh toan don hang:" + vnp_TxnRef);
        vnp_Params.put("vnp_OrderType", orderType);
        vnp_Params.put("vnp_Locale", "vn");
        vnp_Params.put("vnp_ReturnUrl", "http://localhost:3000/counter-sales");
        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

        cld.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

        List fieldNames = new ArrayList(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        Iterator itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = (String) itr.next();
            String fieldValue = (String) vnp_Params.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                //Build hash data
                hashData.append(fieldName);
                hashData.append('=');
                hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                //Build query
                query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()));
                query.append('=');
                query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                if (itr.hasNext()) {
                    query.append('&');
                    hashData.append('&');
                }
            }
        }
        String queryUrl = query.toString();
        String vnp_SecureHash = VNPayConfig.hmacSHA512(VNPayConfig.secretKey, hashData.toString());
        queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
        String paymentUrl = VNPayConfig.vnp_PayUrl + "?" + queryUrl;

        return paymentUrl;
    }
    @Override
    public PaymentResponse updatedPayment(int id,PaymentDTO paymentDTO) {
        Payment payment = paymentRepo.findById(id).orElseThrow(()-> new RuntimeException("not found payment with id:"+id));
        payment.setPaymentDate(paymentDTO.getPaymentDate());
        payment.setPaymentMethod(paymentDTO.getPaymentMethod());
        Optional<Orders> orders = orderRepo.findById(paymentDTO.getOrderId());
        if(orders.isEmpty()){
            throw new RuntimeException("not found order with id:"+ paymentDTO.getOrderId());
        }
        payment.setOrders(orders.get());
        return PaymentResponse.convertPaymentResponse(paymentRepo.save(payment));
    }

    @Override
    public void deletedPayment(int id) {
        Payment payment = paymentRepo.findById(id).orElseThrow(()-> new RuntimeException("not found payment with id:"+id));
        paymentRepo.delete(payment);
    }

    @Override
    public PaymentResponse findById(Integer id) {
        return paymentRepo.findById(id).map(PaymentResponse::convertPaymentResponse).orElseThrow(()->new RuntimeException("not found payment with id:"+id));
    }

    @Override
    public Payment findByOrdersId(Integer orderId) {
        return paymentRepo.findByOrdersId(orderId);
    }
}
