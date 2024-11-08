package com.example.demo.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConfirmResetDTO {
    @NotBlank
    @Email
    private String email;
    @NotBlank
    private String code;
    @NotBlank
    private String newPassword;
}
