package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;


@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class SizeDTO {

    @NotBlank(message = "Code can't empty")
    private String code;

    @NotBlank(message = "Name can't empty")
    private String name;

    private byte status;
}
