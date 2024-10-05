package com.example.demo.service;

import com.example.demo.request.ChatboxRequest;
import com.example.demo.response.ChatboxResponse;

public interface ChatboxService {
    ChatboxResponse callChatbot(ChatboxRequest chatboxRequest);
}
