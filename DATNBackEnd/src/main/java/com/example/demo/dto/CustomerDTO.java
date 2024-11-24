package com.example.demo.dto;


import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Date;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CustomerDTO {
    @NotBlank(message = "username not be blank")
    private String username;
    @NotBlank(message = "password not be blank")
    private String password;
    @NotBlank(message = "email not be blank")
    private String email;

    @NotBlank(message = "phoneNumber not be blank")
    private String phoneNumber;
    private String name;
    private LocalDateTime dateOfBirth;
    private String address;
    private int status;

    private String notes;

    private int gender;
}
