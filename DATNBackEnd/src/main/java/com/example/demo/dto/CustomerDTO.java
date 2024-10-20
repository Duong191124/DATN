package com.example.demo.dto;


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
    private String username;

    private String password;

    private String email;

    private String address;

    private String phoneNumber;

    private int status;

    private LocalDateTime dateOfBirth;

    private String name;

    private String notes;

    private int gender;
}
