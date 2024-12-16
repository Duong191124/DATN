package com.example.demo.service.impl;

import com.example.demo.request.ChatboxRequest;
import com.example.demo.response.ChatboxResponse;
import com.example.demo.service.ChatboxService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class ChatboxServiceImpl implements ChatboxService {
    @Autowired
    private RestTemplate restTemplate;
    @Override
    public ChatboxResponse callChatbot(ChatboxRequest chatboxRequest){
        String url = "http://127.0.0.1:5000/chat";
        try {
            return restTemplate.postForObject(url, chatboxRequest, ChatboxResponse.class);
        }catch (Exception e){
            System.err.println("Lỗi khi gửi yêu cầu: " + e.getMessage());
            return null;
        }
    }
}
