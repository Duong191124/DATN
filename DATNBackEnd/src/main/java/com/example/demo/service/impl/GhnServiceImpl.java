package com.example.demo.service.impl;

import com.example.demo.dto.GhnDTO;
import com.example.demo.dto.ServiceGhnDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class GhnServiceImpl {

//    @Value("${ghn.api.base.url}")
//    private String baseUrl;
//
//    @Value("${ghn.api.key}")
//    private String key;
//
//    @Value("${ghn.shop.id}")
//    private String shopId;
//
//    private final RestTemplate restTemplate = new RestTemplate();
//
//    public String getService(ServiceGhnDTO serviceGhnDTO) {
//        String url = baseUrl + "/v2/shipping-order/available-services";
//
//        HttpHeaders headers = new HttpHeaders();
//        headers.set("Token", key);
//
//        Map<String, Object> requestBody = new HashMap<>();
//        requestBody.put("shop_id", serviceGhnDTO.getShopId());
//        requestBody.put("from_district", serviceGhnDTO.getFromDistrictID());
//        requestBody.put("to_district", serviceGhnDTO.getToDistrictID());
//
//        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);
//        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, requestEntity, String.class);
//        return response.getBody();
//    }
//
//    public String getShippingFee(GhnDTO ghnDTO) {
//        String url = baseUrl + "/v2/shipping-order/fee";
//
//        HttpHeaders headers = new HttpHeaders();
//        headers.set("Token", key);
//        headers.set("shop_id", shopId);
//
//        // Set the request body
//        Map<String, Object> requestBody = new HashMap<>();
//        requestBody.put("from_district_id", ghnDTO.getFromDistrictId());
//        requestBody.put("to_district_id", ghnDTO.getToDistrictId());
//        requestBody.put("to_ward_code", ghnDTO.getToWardCode());
//        requestBody.put("service_id", ghnDTO.getServiceId());
//        requestBody.put("weight", ghnDTO.getWeight());
//
//        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);
//
//        try {
//            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, requestEntity, String.class);
//            return response.getBody();
//        } catch (HttpClientErrorException e) {
//            System.out.println("Error in API call: " + e.getResponseBodyAsString());
//            throw e;
//        }
//    }
//
//    public String getProvinces() {
//        String url = baseUrl + "/master-data/province";
//        HttpHeaders headers = new HttpHeaders();
//        headers.set("Token", key);
//        HttpEntity<Void> requestEntity = new HttpEntity<>(headers);
//        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, requestEntity, String.class);
//        return response.getBody();
//    }
//
//    public String getDistricts(int provinceId) {
//        String url = baseUrl + "/master-data/district";
//        HttpHeaders headers = new HttpHeaders();
//        headers.set("Token", key);
//
//        Map<String, Object> requestBody = new HashMap<>();
//        requestBody.put("province_id", provinceId);
//
//        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);
//        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, requestEntity, String.class);
//        return response.getBody();
//    }
//
//    public String getWards(int districtId) {
//        String url = baseUrl + "/master-data/ward";
//        HttpHeaders headers = new HttpHeaders();
//        headers.set("Token", key);
//
//        Map<String, Object> requestBody = new HashMap<>();
//        requestBody.put("district_id", districtId);
//
//        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);
//        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, requestEntity, String.class);
//        return response.getBody();
//    }

}
