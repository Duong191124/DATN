package com.example.demo.service.impl;

import com.example.demo.dto.GhnDTO;
import com.example.demo.dto.GhnOrderDTO;
import com.example.demo.dto.ServiceGhnDTO;
import com.example.demo.entity.ProductDetail;
import com.example.demo.service.GhnService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.Collections;
import java.util.Map;
import java.util.HashMap;


@Service
public class GhnServiceImpl implements GhnService {

    @Value("${ghn.api.base.url}")
    private String baseUrl;

    @Value("${ghn.api.key}")
    private String key;

    @Value("${ghn.shop.id}")
    private String shopId;

    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public String createOrder(GhnOrderDTO ghnOrderDTO) throws JsonProcessingException {
        String url = baseUrl + "/v2/shipping-order/create";

        HttpHeaders headers = new HttpHeaders();
        headers.set("Token", key); // Thêm Token
        headers.set("ShopId", shopId); // Thêm ShopId
        headers.setContentType(MediaType.APPLICATION_JSON); // Đặt content type là JSON

        int paymentTypeId = ghnOrderDTO.getPaymentType(); // 1 cửa hàng thanh toán/ 2 Người mua thanh toán
        String note = "Be careful"; // Ghi chú cho tài xế
        String requiredNote = "KHONGCHOXEMHANG"; // Ghi chú bắt buộc
        String returnPhone = "0986845301"; // Số điện thoại trả hàng
        int codAmount = ghnOrderDTO.getShipCOD(); // Tiền thu hộ (COD)
        String content = "Nội dung đơn hàng"; // Mô tả đơn hàng
        int weight = ghnOrderDTO.getWeight(); // Lấy trọng lượng từ GhnOrderDTO
        int length = 1; // Chiều dài cố định
        int width = 19; // Chiều rộng cố định
        int height = 10; // Chiều cao cố định
        int pickStationId = 1444; // Mã bưu cục gửi hàng
        int insuranceValue = 10000; // Giá trị bảo hiểm của đơn hàng
        int serviceTypeId = 2; // Mã loại dịch vụ: 2 - Đi Bộ

        JSONObject requestBody = new JSONObject();
        requestBody.put("payment_type_id", paymentTypeId);
        requestBody.put("note", note);
        requestBody.put("required_note", requiredNote);
        requestBody.put("return_phone", returnPhone);
        requestBody.put("return_ward_code", ""); // Phường trả hàng
        requestBody.put("client_order_code", ""); // Mã đơn hàng khách hàng (nếu có)
        requestBody.put("to_name", ghnOrderDTO.getCustomerName()); // Tên người nhận
        requestBody.put("to_phone", ghnOrderDTO.getCustomerPhone()); // Số điện thoại người nhận
        requestBody.put("to_address", ghnOrderDTO.getAddressDetail()); // Địa chỉ người nhận
        requestBody.put("to_ward_code", ghnOrderDTO.getToWardCode()); // Lấy mã phường từ GhnOrderDTO
        requestBody.put("to_district_id", ghnOrderDTO.getToDistrictId()); // Lấy mã quận từ GhnOrderDTO
        requestBody.put("cod_amount", codAmount); // Tiền thu hộ
        requestBody.put("content", content); // Mô tả đơn hàng
        requestBody.put("weight", weight); // Trọng lượng đơn hàng
        requestBody.put("length", length); // Chiều dài
        requestBody.put("width", width); // Chiều rộng
        requestBody.put("height", height); // Chiều cao
        requestBody.put("pick_station_id", pickStationId); // Mã bưu cục
        requestBody.put("insurance_value", insuranceValue); // Giá trị bảo hiểm
        requestBody.put("service_type_id", serviceTypeId); // Mã loại dịch vụ
        requestBody.put("pick_shift", new JSONArray().put(2)); // Ca lấy hàng
        JSONArray itemsArray = new JSONArray();
        for (ProductDetail product : ghnOrderDTO.getItems()) {
            JSONObject productJson = new JSONObject();
            productJson.put("name", product.getProduct().getName());
            productJson.put("code", product.getCode());
            productJson.put("quantity", product.getQuantity());
            JSONObject categoryJson = new JSONObject();
            productJson.put("category", categoryJson);
            itemsArray.put(productJson);
        }
        requestBody.put("items", itemsArray);

        HttpEntity<String> entity = new HttpEntity<>(requestBody.toString(), headers);

        try {
            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);
            JsonNode rootNode = new ObjectMapper().readTree(response.getBody());
            String messageDisplay = rootNode.path("message_display").asText();

            return messageDisplay.replace("Tạo đơn hàng thành công. Mã đơn hàng: ", "").trim();
        } catch (Exception e) {
            throw new RuntimeException("Giao hàng nhanh không hỗ trợ xã này");
        }
    }

    @Override
    public String cancelOrder(String trackingCode) throws JsonProcessingException {
        String url = baseUrl + "/v2/switch-status/cancel";

        // Set HTTP headers
        HttpHeaders headers = new HttpHeaders();
        headers.set("Token", key);
        headers.set("shop_id", shopId);

        // Set request body
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("order_codes", Collections.singletonList(trackingCode));

        // Create HttpEntity with body and headers
        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);

        // Send HTTP POST request
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, requestEntity, String.class);

        // Return response body
        return response.getBody();
    }


    @Override
    public String getService(ServiceGhnDTO serviceGhnDTO) {
        String url = baseUrl + "/v2/shipping-order/available-services";

        HttpHeaders headers = new HttpHeaders();
        headers.set("Token", key);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("shop_id", serviceGhnDTO.getShopId());
        requestBody.put("from_district", serviceGhnDTO.getFromDistrictID());
        requestBody.put("to_district", serviceGhnDTO.getToDistrictID());

        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, requestEntity, String.class);
        return response.getBody();
    }

    @Override
    public String getShippingFee(GhnDTO ghnDTO) {
        String url = baseUrl + "/v2/shipping-order/fee";

        HttpHeaders headers = new HttpHeaders();
        headers.set("Token", key);
        headers.set("shop_id", shopId);

        // Set the request body
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("from_district_id", ghnDTO.getFromDistrictId());
        requestBody.put("to_district_id", ghnDTO.getToDistrictId());
        requestBody.put("to_ward_code", ghnDTO.getToWardCode());
        requestBody.put("service_id", ghnDTO.getServiceId());
        requestBody.put("weight", ghnDTO.getWeight());

        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, requestEntity, String.class);
            return response.getBody();
        } catch (Exception e) {
            throw new RuntimeException("Giao hàng nhanh không hỗ trợ xã này");
        }
    }

    @Override
    public String getProvinces() {
        String url = baseUrl + "/master-data/province";
        HttpHeaders headers = new HttpHeaders();
        headers.set("Token", key);
        HttpEntity<Void> requestEntity = new HttpEntity<>(headers);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, requestEntity, String.class);
        return response.getBody();
    }

    @Override
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

    @Override
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

