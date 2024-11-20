package com.example.demo.exception;

public class EmailExisting extends RuntimeException{
    public EmailExisting() {
        super("Email existing in database");
    }
    public EmailExisting(String message) {
        super(message);
    }
}
