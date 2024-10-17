package com.example.demo.dto;


import jakarta.validation.constraints.NotBlank;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Data
@Builder
public class ColorDTO {
    @NotBlank(message = "Code cannot be emtity")

    private String code;
    @NotBlank(message = "name cannot be emtity")
    private String name;

    private int status;
}
