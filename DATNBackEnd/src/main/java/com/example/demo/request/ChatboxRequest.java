package com.example.demo.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatboxRequest {
    @JsonProperty("message")
    private String message;
}
