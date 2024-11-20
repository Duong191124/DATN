package com.example.demo.exception;

public class JwtOldVersion extends RuntimeException{
    public JwtOldVersion() {
        super("Please login again to get new token");
    }

}
