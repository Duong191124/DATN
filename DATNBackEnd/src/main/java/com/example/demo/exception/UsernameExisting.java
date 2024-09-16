package com.example.demo.exception;

public class UsernameExisting extends RuntimeException {

    public UsernameExisting() {
        super("Username existing in database");
    }
    public UsernameExisting(String message) {
        super(message);
    }
}