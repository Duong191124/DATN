package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class CategoryDTO {
    @NotBlank(message = "Name can't empty")
    private String name;
}
