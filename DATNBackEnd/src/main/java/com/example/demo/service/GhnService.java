package com.example.demo.service;

import com.example.demo.dto.GhnDTO;
import com.example.demo.dto.GhnOrderDTO;
import com.example.demo.dto.ServiceGhnDTO;
import com.fasterxml.jackson.core.JsonProcessingException;

public interface GhnService {
    String getService(ServiceGhnDTO serviceGhnDTO);
    String getShippingFee(GhnDTO ghnDTO);
    String getProvinces();
    String getDistricts(int provinceId);
    String getWards(int districtId);

    String createOrder(GhnOrderDTO ghnOrderDTO) throws JsonProcessingException;
}
