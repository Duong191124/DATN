package com.example.demo.controller;

import com.example.demo.dto.AccountDTO;
import com.example.demo.dto.LoginDTO;

import com.example.demo.response.LoginResponse;
import com.example.demo.response.MessageReponse;
import com.example.demo.service.AccountService;
import com.example.demo.utility.SecurityUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${api.prefix}/account")
public class AccountController {
    @Autowired
    AccountService accountService;

    @Autowired
    AuthenticationManagerBuilder authenticationManagerBuilder;

    @Autowired
    SecurityUtil securityUtil;
    @GetMapping("/getAll")
    public ResponseEntity<?> getALlUser(
            @RequestParam(name = "page", defaultValue = "1")int page,
            @RequestParam(name ="size", defaultValue = "10")int size)
    {
        try{
            return ResponseEntity.status(HttpStatus.OK).body(
                    MessageReponse
                            .builder()
                            .message("get all account successfully")
                            .status(HttpStatus.OK.value())
                            .data(accountService.getAll(page-1, size))
                            .build()
            );
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    MessageReponse.builder()
                            .message("Error: " + e.getMessage().toUpperCase())
                            .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .build()
            );
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody AccountDTO accountDTO){

        try{
            return ResponseEntity.status(HttpStatus.OK).body(
                    MessageReponse
                            .builder()
                            .message("register account successfully")
                            .status(HttpStatus.OK.value())
                            .data(accountService.save(accountDTO))
                            .build()

            );
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    MessageReponse.builder()
                            .message("Error: " + e.getMessage().toUpperCase())
                            .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .build()
            );
        }
    }

    @PostMapping("/signin")
    public ResponseEntity<?> loginUser(@RequestBody LoginDTO loginDTO){
        //create token by username and password
        UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken =
                new UsernamePasswordAuthenticationToken(loginDTO.getUsername(), loginDTO.getPassword());

        //authenticate  token throught userdetails service
        Authentication authentication =
                authenticationManagerBuilder.getObject().authenticate(usernamePasswordAuthenticationToken);

        //create token
        String token = securityUtil.createToken(authentication);

        return ResponseEntity.status(HttpStatus.OK).body(
                LoginResponse
                        .builder()
                        .status(HttpStatus.OK.value())
                        .message("login succesfuly")
                        .token(token)
                        .build()
        );
    }
}
