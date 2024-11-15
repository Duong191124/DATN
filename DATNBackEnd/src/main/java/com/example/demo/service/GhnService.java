package com.example.demo.service;

import com.example.demo.dto.GhnDTO;
import com.example.demo.dto.ServiceGhnDTO;

public interface GhnService {
    String getService(ServiceGhnDTO serviceGhnDTO);
    String getShippingFee(GhnDTO ghnDTO);
    String getProvinces();
    String getDistricts(int provinceId);
    String getWards(int districtId);
}
