package com.example.demo.controller;

import com.example.demo.service.impl.GhnServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${api.prefix}/ghn")
public class GhnController {

    @Autowired
    private GhnServiceImpl ghnService;

    @GetMapping("/provinces")
    public String getProvinces() {
        return ghnService.getProvinces();
    }

    @GetMapping("/districts")
    public String getDistricts(@RequestParam int provinceId) {
        return ghnService.getDistricts(provinceId);
    }

    @GetMapping("/wards")
    public String getWards(@RequestParam int districtId) {
        return ghnService.getWards(districtId);
    }

    @PostMapping("/shipping-fee")
    public String getShippingFee(@RequestParam String fromDistrictId, @RequestParam String toDistrictId, @RequestParam String toWardCode) {
        return ghnService.getShippingFee(fromDistrictId, toDistrictId, toWardCode);
    }
}
