package com.example.demo.controller;

import com.example.demo.dto.ConfirmResetDTO;
import com.example.demo.dto.LoginDTO;
import com.example.demo.entity.Customer;
import com.example.demo.entity.PasswordResetRequest;
import com.example.demo.entity.Staff;
import com.example.demo.repository.CustomerRepo;
import com.example.demo.repository.PasswordResetRequestRepo;
import com.example.demo.repository.StaffRepo;
import com.example.demo.dto.ForgotPasswordDTO;
import com.example.demo.response.InformationResponse;
import com.example.demo.response.LoginResponse;
import com.example.demo.response.MessageReponse;
import com.example.demo.utils.MailService;
import com.example.demo.utils.SecurityUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.InputMismatchException;
import java.util.List;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
@RestController
@RequestMapping("${api.prefix}/auth")
public class AuthController {

    @Autowired
    private AuthenticationManagerBuilder authenticationManagerBuilder;

    @Autowired
    SecurityUtil securityUtil;

    @Autowired
    CustomerRepo customerRepo;
    @Autowired
    StaffRepo staffRepo;
    @Autowired
    private MessageSource messageSource;

    @Autowired
    PasswordResetRequestRepo passwordResetRequestRepo;

    @Autowired
    MailService mailService;
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

            SecurityContextHolder.getContext().setAuthentication(authentication);

            //generate token
            String token = securityUtil.createToken(authentication);

            if(customerRepo.existsByUsername(loginDTO.getUsername())) {
                return ResponseEntity.status(HttpStatus.OK).body(
                        LoginResponse.builder()
                                .message(messageSource.getMessage("auth.login.success", null, LocaleContextHolder.getLocale()))
                                .status(HttpStatus.OK.value())
                                .token(token)
                                .build()
                );
            }else if(staffRepo.existsByUsername(loginDTO.getUsername())) {
                return ResponseEntity.status(HttpStatus.CREATED).body(
                        LoginResponse.builder()
                                .message(messageSource.getMessage("auth.login.success", null, LocaleContextHolder.getLocale()))
                                .status(HttpStatus.CREATED.value())
                                .token(token)
                                .build()
                );
            }
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                    LoginResponse.builder()
                            .token(null)
                            .status(HttpStatus.UNAUTHORIZED.value())
                            .message(messageSource.getMessage("auth.login.invalid", null, LocaleContextHolder.getLocale()))
                            .build()
            );
        }
    }

    @GetMapping("/getInformation")
    public ResponseEntity<?> getInfoUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentPrincipalName = null;

        // Kiểm tra nếu có người dùng đăng nhập
        if (authentication != null && authentication.isAuthenticated()) {
            currentPrincipalName = authentication.getName();
        }

        // In ra để kiểm tra giá trị của currentPrincipalName
        System.out.println("Current principal name: " + currentPrincipalName);

        if (currentPrincipalName != null && !currentPrincipalName.isEmpty() && customerRepo.existsByUsername(currentPrincipalName)) {
            // Nếu người dùng đã đăng nhập là khách hàng
            Customer customer = customerRepo.findByUsername(currentPrincipalName);
            return ResponseEntity.status(HttpStatus.OK).body(
                    MessageReponse.builder()
                            .data(
                                    InformationResponse.builder()
                                            .id(customer.getId())
                                            .name(customer.getName())
                                            .email(customer.getEmail())
                                            .phoneNumber(customer.getPhoneNumber())
                                            .build()
                            )
                            .status(HttpStatus.OK.value())
                            .message("Get information successfully")
                            .build());
        } else if (currentPrincipalName != null && !currentPrincipalName.isEmpty() && staffRepo.existsByUsername(currentPrincipalName)) {
            // Nếu người dùng đã đăng nhập là nhân viên
            Staff staff = staffRepo.findByUsername(currentPrincipalName);
            return ResponseEntity.status(HttpStatus.OK).body(
                    MessageReponse.builder()
                            .data(staff)
                            .status(HttpStatus.OK.value())
                            .message("Get information successfully")
                            .build()
            );
        } else {
            // Nếu không có người dùng đăng nhập, lấy khách hàng mặc định với ID 1
            Customer defaultCustomer = customerRepo.findById(1)
                    .orElseThrow(() -> new RuntimeException("Customer with ID 1 not found"));

            return ResponseEntity.status(HttpStatus.OK).body(
                    MessageReponse.builder()
                            .data(
                                    InformationResponse.builder()
                                            .id(defaultCustomer.getId())
                                            .name(defaultCustomer.getName())
                                            .email(defaultCustomer.getEmail())
                                            .phoneNumber(defaultCustomer.getPhoneNumber())
                                            .build()
                            )
                            .status(HttpStatus.OK.value())
                            .message("Get default customer information successfully")
                            .build());
        }
    }



    @PostMapping("/request-reset-password")
    public ResponseEntity<?> forgot(
            @Validated @RequestBody ForgotPasswordDTO forgotPasswordDTO,
            BindingResult result
    ) {

        // Validate class
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
        // Find account
        if (customerRepo.existsByEmail(forgotPasswordDTO.getEmail())) {

            //get account by mail
            Customer customer = customerRepo.findByEmail(forgotPasswordDTO.getEmail());
            //create if not exist
            if(customer.getPasswordResetRequest() == null){
                PasswordResetRequest passwordResetRequest = passwordResetRequestRepo.save(new PasswordResetRequest(
                        null,
                        "000",
                        LocalDateTime.now().plus(15, ChronoUnit.MINUTES),
                        true
                ));
                customer.setPasswordResetRequest(passwordResetRequest);
                customerRepo.save(customer);
            }
            //get current PasswordResetRequest
            PasswordResetRequest newPasswordRequest = customer.getPasswordResetRequest();
            //update new PasswordResetRequest
            newPasswordRequest.setResetCode(this.generateResetCode()+"");
            newPasswordRequest.setExpirationDate(LocalDateTime.now().plus(15, ChronoUnit.MINUTES));
            customer.setPasswordResetRequest(newPasswordRequest);
            //save to database
            customerRepo.save(customer);
            //send mail
            mailService.sendMailReset(forgotPasswordDTO.getEmail(), newPasswordRequest.getResetCode());

            return ResponseEntity.ok().body(MessageReponse.builder()
                    .message("Request reset password successfully")
                    .status(HttpStatus.OK.value())
                    .data("Just send code to: " + forgotPasswordDTO.getEmail())
                    .build());
        } else if (staffRepo.existsByEmail(forgotPasswordDTO.getEmail())) {

            //get account by mail
            Staff staff = staffRepo.findByEmail(forgotPasswordDTO.getEmail());
            //create if not exist
            if(staff.getPasswordResetRequest() == null){

                PasswordResetRequest passwordResetRequest = passwordResetRequestRepo.save(new PasswordResetRequest(
                        null,
                        "000",
                        LocalDateTime.now().plus(15, ChronoUnit.MINUTES),
                        true
                        ));
                staff.setPasswordResetRequest(passwordResetRequest);
                staffRepo.save(staff);
            }
            //get current PasswordResetRequest
            PasswordResetRequest newPasswordRequest = staff.getPasswordResetRequest();
            //update new PasswordResetRequest
            newPasswordRequest.setResetCode(this.generateResetCode()+"");
            newPasswordRequest.setExpirationDate(LocalDateTime.now().plus(15, ChronoUnit.MINUTES));
            staff.setPasswordResetRequest(newPasswordRequest);
            //save to database
            staffRepo.save(staff);
            //send mail
            mailService.sendMailReset(forgotPasswordDTO.getEmail(), newPasswordRequest.getResetCode());

            return ResponseEntity.ok().body(MessageReponse.builder()
                    .message("Request reset password successfully")
                    .status(HttpStatus.OK.value())
                    .data("Just send code to: " + forgotPasswordDTO.getEmail())
                    .build());
        } else {
            // if not found
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(MessageReponse.builder()
                    .message("Account not found")
                    .status(HttpStatus.NOT_FOUND.value())
                    .data("No customer or staff found with email: " + forgotPasswordDTO.getEmail())
                    .build());
        }


    }

    @PostMapping("/confirm-set-password")
    public ResponseEntity<?> confirm(
            @Validated @RequestBody ConfirmResetDTO confirmResetDTO,
            BindingResult result
    ){
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        // Validate class
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

        // Find account
        if (customerRepo.existsByEmail(confirmResetDTO.getEmail())) {
            Customer customer = customerRepo.findByEmail(confirmResetDTO.getEmail());
            if(customer.getPasswordResetRequest().getExpirationDate().isBefore(LocalDateTime.now())){
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(MessageReponse.builder()
                        .message("The code has expired")
                        .status(HttpStatus.BAD_REQUEST.value())
                        .data(null)
                        .build());
            }
            if(customer.getPasswordResetRequest().getResetCode().equals( confirmResetDTO.getCode())){
                customer.setPassword(passwordEncoder.encode(confirmResetDTO.getNewPassword()));
                customerRepo.save(customer);
                return ResponseEntity.ok().body(MessageReponse.builder()
                        .message("reset password successfully")
                        .status(HttpStatus.OK.value())
                        .data("updated password for: " + confirmResetDTO.getEmail())
                        .build());
            }else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(MessageReponse.builder()
                        .message("code reset invalid")
                        .status(HttpStatus.BAD_REQUEST.value())
                        .data(null)
                        .build());
            }
        } else if (staffRepo.existsByEmail(confirmResetDTO.getEmail())) {
            Staff staff = staffRepo.findByEmail(confirmResetDTO.getEmail());
            if(staff.getPasswordResetRequest().getExpirationDate().isBefore(LocalDateTime.now())){
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(MessageReponse.builder()
                        .message("The code has expired")
                        .status(HttpStatus.BAD_REQUEST.value())
                        .data(null)
                        .build());
            }
            if(staff.getPasswordResetRequest().getResetCode().equals(confirmResetDTO.getCode())) {
                staff.setPassword(passwordEncoder.encode(confirmResetDTO.getNewPassword()));
                staffRepo.save(staff);

                return ResponseEntity.ok().body(MessageReponse.builder()
                        .message("reset password successfully")
                        .status(HttpStatus.OK.value())
                        .data("updated password for: " + confirmResetDTO.getEmail())
                        .build());
            }else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(MessageReponse.builder()
                        .message("code reset invalid")
                        .status(HttpStatus.BAD_REQUEST.value())
                        .data(null)
                        .build());
            }
        } else {
            // if not found
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(MessageReponse.builder()
                    .message("Account not found")
                    .status(HttpStatus.NOT_FOUND.value())
                    .data("No customer or staff found with email: " + confirmResetDTO.getEmail())
                    .build());
        }

    }
    public static int generateResetCode() {
        int min = 284123;
        int max = 999999;
        return (int) (Math.random() * (max - min + 1)) + min;
    }

}