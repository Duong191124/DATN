package com.example.demo.controller;

import com.example.demo.dto.GhnDTO;
import com.example.demo.dto.GhnOrderDTO;
import com.example.demo.dto.ServiceGhnDTO;
import com.example.demo.response.MessageReponse;
import com.example.demo.service.impl.GhnServiceImpl;
import com.example.demo.utils.MailService;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.prefix}/ghn")
public class GhnController {

    @Autowired
    private GhnServiceImpl ghnService;

    @Autowired
    private MailService mailService;

    @GetMapping("/provinces")
    public ResponseEntity<?> getProvinces() {
        return ResponseEntity.ok(ghnService.getProvinces());
    }

    @GetMapping("/districts")
    public ResponseEntity<?> getDistricts(@RequestParam int provinceId) {
        return ResponseEntity.ok(ghnService.getDistricts(provinceId));
    }

    @PostMapping("/service")
    public ResponseEntity<?> getService(@RequestBody ServiceGhnDTO serviceGhnDTO) {
        return ResponseEntity.ok(ghnService.getService(serviceGhnDTO));
    }

    @GetMapping("/wards")
    public ResponseEntity<?> getWards(@RequestParam int districtId) {
        return ResponseEntity.ok(ghnService.getWards(districtId));
    }

    @PostMapping("/shipping-fee")
    public ResponseEntity<?> getShippingFee(@RequestBody GhnDTO ghnDTO) {
        return ResponseEntity.ok(ghnService.getShippingFee(ghnDTO));
    }

    @PostMapping("/create-order-ghn")
    public ResponseEntity<?> createOrderGhn(@Validated @RequestBody GhnOrderDTO ghnOrderDTO, BindingResult result) throws JsonProcessingException {
        if(result.hasErrors()){
            List<String> errorMessage = result.getFieldErrors()
                    .stream()
                    .map(FieldError::getDefaultMessage)
                    .toList();
            return ResponseEntity.badRequest().body(
                    MessageReponse
                            .builder()
                            .data(null)
                            .status(HttpStatus.BAD_REQUEST.value())
                            .message(errorMessage.toString())
                            .build()
            );
        }

        String trackingID = ghnService.createOrder(ghnOrderDTO);
        mailService.sendTrackingOrder(ghnOrderDTO.getCustomerEmail(), trackingID);
        return ResponseEntity.ok(
                MessageReponse
                        .builder()
                        .data(trackingID)
                        .status(HttpStatus.OK.value())
                        .message("Please check your email to get tracking order")
                        .build()
        );
    }
}
