package com.example.demo.config;

import com.example.demo.response.MessageReponse;
import org.springframework.core.MethodParameter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.RestController;

@ControllerAdvice(annotations = RestController.class)
public class GlobalResponseHandler implements org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice<Object> {

    @Override
    public boolean supports(MethodParameter returnType, Class<? extends HttpMessageConverter<?>> converterType) {
        // Áp dụng với tất cả các response
        return true;
    }

    @Override
    public Object beforeBodyWrite(Object body, MethodParameter returnType, org.springframework.http.MediaType selectedContentType,
                                  Class<? extends HttpMessageConverter<?>> selectedConverterType,
                                  org.springframework.http.server.ServerHttpRequest request,
                                  org.springframework.http.server.ServerHttpResponse response) {
        if (body instanceof MessageReponse) {
            return body;
        }

        return MessageReponse.builder()
                .message("Request processed successfully")
                .status(HttpStatus.OK.value())
                .data(body)
                .build();
    }
}

