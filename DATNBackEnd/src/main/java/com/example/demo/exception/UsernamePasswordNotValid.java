package com.example.demo.exception;

public class UsernamePasswordNotValid extends RuntimeException {

    public UsernamePasswordNotValid() {
        super("Username or password is not valid");
    }

    public UsernamePasswordNotValid(String message) {
        super(message);
    }
}
