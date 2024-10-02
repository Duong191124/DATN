package com.example.demo.controller;

import com.example.demo.dto.LoginDTO;
import com.example.demo.entity.Customer;
import com.example.demo.entity.Staff;
import com.example.demo.repository.CustomerRepo;
import com.example.demo.repository.StaffRepo;
import com.example.demo.response.InformationResponse;
import com.example.demo.response.LoginResponse;
import com.example.demo.response.MessageReponse;
import com.example.demo.utils.SecurityUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.InputMismatchException;
import java.util.List;

@RestController
@RequestMapping("${api.prefix}/auth")
public class AuthController {
    @Autowired
    AuthenticationManagerBuilder authenticationManagerBuilder;

    @Autowired
    SecurityUtil securityUtil;

    @Autowired
    CustomerRepo customerRepo;
    @Autowired
    StaffRepo staffRepo;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Validated @RequestBody LoginDTO loginDTO, BindingResult result) {
        if (result.hasErrors()) {
            List<String> errorMessage = result.getFieldErrors()
                    .stream()
                    .map(FieldError::getDefaultMessage)
                    .toList();
            return ResponseEntity.badRequest().body(MessageReponse.builder()
                    .message(errorMessage.toString())
                    .status(HttpStatus.BAD_REQUEST.value())
                    .build());
        }
        //create token by username and password
        UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken =
                new UsernamePasswordAuthenticationToken(loginDTO.getUsername(), loginDTO.getPassword());

        try {
            //authenticate  token throught userdetails service
            Authentication authentication =
                    authenticationManagerBuilder.getObject().authenticate(usernamePasswordAuthenticationToken);

            //generate token
            String token = securityUtil.createToken(authentication);
            return ResponseEntity.status(HttpStatus.OK).body(
                    LoginResponse.builder()
                            .message("Login successfuly")
                            .status(HttpStatus.OK.value())
                            .token(token)
                            .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                    LoginResponse.builder()
                            .token(null)
                            .status(HttpStatus.UNAUTHORIZED.value())
                            .message("Username or password is not valid")
                            .build()
            );
        }
    }

    @GetMapping("/getInformation")
    public ResponseEntity<?> getInfoUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentPrincipalName = authentication.getName();

        if (customerRepo.existsByUsername(currentPrincipalName)) {
            Customer customer = customerRepo.findByUsername(currentPrincipalName);
            return ResponseEntity.status(HttpStatus.OK).body(
                    MessageReponse.builder()
                            .data(
                                    InformationResponse.builder()
                                            .id(customer.getId())
                                            .name(customer.getName())
                                            .email(customer.getEmail())
//                                            .role(customer.getRole().getName())
                                            .build()
                            )
                            .status(HttpStatus.OK.value())
                            .message("Get information sucssessfuly")
                            .build());
        } else if (staffRepo.existsByUsername(currentPrincipalName)) {
            Staff staff = staffRepo.findByUsername(currentPrincipalName);

            return ResponseEntity.status(HttpStatus.OK).body(
                    MessageReponse.builder()
                            .data(
                                    InformationResponse.builder()
                                            .id(staff.getId())
                                            .name(staff.getName())
                                            .email(staff.getEmail())
                                            .role(staff.getRole().getName())
                                            .build()
                            )
                            .status(HttpStatus.OK.value())
                            .message("Get information sucssessfuly")
                            .build()
            );
        } else {
            throw new InputMismatchException("Token is not valid");
        }
    }
}
