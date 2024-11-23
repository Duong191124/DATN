package com.example.demo.dto;


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

    private String address;
    @NotBlank(message = "phoneNumber not be blank")
    private String phoneNumber;

    private int status;

    private LocalDateTime dateOfBirth;

    private String name;

    private String notes;

    private int gender;
}
