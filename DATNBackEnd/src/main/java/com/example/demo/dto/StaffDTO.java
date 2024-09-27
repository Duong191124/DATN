package com.example.demo.dto;


import lombok.*;

import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class StaffDTO {
    private String username;

    private String password;

    private String email;

    private String address;

    private String phoneNumber;

    private int status;

    private Date dateOfBirth;

    private String name;

    private String notes;

    private int gender;

//    private Integer roleId;
}
