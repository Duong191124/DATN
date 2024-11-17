package com.example.demo.controller;

import com.example.demo.dto.GhnDTO;
import com.example.demo.dto.ServiceGhnDTO;
import com.example.demo.service.impl.GhnServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${api.prefix}/ghn")
public class GhnController {

    @Autowired
    private GhnServiceImpl ghnService;

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
}
