package com.example.demo.controller;

import com.example.demo.request.ChatboxRequest;
import com.example.demo.response.ChatboxResponse;
import com.example.demo.service.ChatboxService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("${api.prefix}/chatbox")
public class ChatboxController {
    @Autowired
    private ChatboxService chatboxService;
    @PostMapping("/chat")
    public String callChatbot(@RequestBody ChatboxRequest request) {
        ChatboxResponse response = chatboxService.callChatbot(request);
        return response.getResponse().get(0).getGenerated_text();
    }
}
