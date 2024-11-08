package com.example.demo.service.impl;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class GhnServiceImpl {

    @Value("${ghn.api.base.url}")
    private String baseUrl;

    @Value("${ghn.api.key}")
    private String key;

    private final RestTemplate restTemplate = new RestTemplate();

    public String getShippingFee(String fromDistrictId, String toDistrictId, String toWardCode) {
        String url = baseUrl + "/v2/shipping-order/fee";

        HttpHeaders headers = new HttpHeaders();
        headers.set("Token", key);

        // Set the request body
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("from_district_id", fromDistrictId);
        requestBody.put("to_district_id", toDistrictId);
        requestBody.put("to_ward_code", toWardCode);

        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);

        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, requestEntity, String.class);
        return response.getBody();
    }

    public String getProvinces() {
        String url = baseUrl + "/master-data/province";
        HttpHeaders headers = new HttpHeaders();
        headers.set("Token", key);
        HttpEntity<Void> requestEntity = new HttpEntity<>(headers);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, requestEntity, String.class);
        return response.getBody();
    }

    public String getDistricts(int provinceId) {
        String url = baseUrl + "/master-data/district";
        HttpHeaders headers = new HttpHeaders();
        headers.set("Token", key);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("province_id", provinceId);

        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, requestEntity, String.class);
        return response.getBody();
    }

    public String getWards(int districtId) {
        String url = baseUrl + "/master-data/ward";
        HttpHeaders headers = new HttpHeaders();
        headers.set("Token", key);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("district_id", districtId);

        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, requestEntity, String.class);
        return response.getBody();
    }

}
