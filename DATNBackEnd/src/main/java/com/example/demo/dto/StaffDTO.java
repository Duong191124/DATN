package com.example.demo.dto;


import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class StaffDTO {
    @NotBlank(message = "username not be blank")
    private String username;
    @NotBlank(message = "password not be blank")
    private String password;
    @NotBlank
    private String email;

    private String address;
    @NotBlank(message = "phoneNumber not be blank")
    private String phoneNumber;

    private int status;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private Date dateOfBirth;

    private String name;

    private String notes;

    private int gender;

    private Integer permissionId;
}
