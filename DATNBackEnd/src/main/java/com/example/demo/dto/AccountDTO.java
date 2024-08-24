package com.example.demo.dto;

import jakarta.persistence.Basic;
import jakarta.persistence.Column;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.springframework.boot.context.properties.bind.DefaultValue;

import java.util.Date;
@Data
public class AccountDTO {
    @NotBlank
    private String username;
    @NotBlank
    private String password;
    @NotBlank
    private String email;
    private String address;
    @NotBlank
    private String phoneNumber;

    private int status;
    private Date dateOfBirth;
    @NotBlank
    private String name;
    private String notes;
    private int gender;

}
