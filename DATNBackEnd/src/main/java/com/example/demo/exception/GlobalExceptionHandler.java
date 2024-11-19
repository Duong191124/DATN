package com.example.demo.exception;

import com.example.demo.response.MessageReponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.NoHandlerFoundException;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<MessageReponse> handleAllExceptions(Exception ex) {
        MessageReponse response = MessageReponse.builder()
                .message("An unexpected error occurred: " + ex.getMessage())
                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .data(null)
                .build();
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // Xử lý lỗi 404 - Not Found
    @ExceptionHandler(NoHandlerFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ResponseEntity<MessageReponse> handleNoHandlerFound(NoHandlerFoundException e, WebRequest request) {
        MessageReponse response = MessageReponse.builder()
                .message("No handler found for the requested URL: " + e.getRequestURL())
                .status(HttpStatus.NOT_FOUND.value())
                .data(null)
                .build();
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    // Xử lý lỗi 400 - Bad Request
    @ExceptionHandler(HttpMessageNotReadableException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<MessageReponse> handleHttpMessageNotReadable(HttpMessageNotReadableException ex) {
        MessageReponse response = MessageReponse.builder()
                .message("Invalid JSON request: " + ex.getMessage())
                .status(HttpStatus.BAD_REQUEST.value())
                .data(null)
                .build();
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }



    // Xử lý lỗi NullPointerException
    @ExceptionHandler(NullPointerException.class)
    public ResponseEntity<MessageReponse> handleNullPointerException(NullPointerException ex) {
        MessageReponse response = MessageReponse.builder()
                .message("Null Pointer Exception: " + ex.getMessage())
                .status(HttpStatus.BAD_REQUEST.value())
                .data(null)
                .build();
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    // Xử lý lỗi IllegalArgumentException
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<MessageReponse> handleIllegalArgumentException(IllegalArgumentException ex) {
        MessageReponse response = MessageReponse.builder()
                .message("Invalid argument: " + ex.getMessage())
                .status(HttpStatus.BAD_REQUEST.value())
                .data(null)
                .build();
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }
}
