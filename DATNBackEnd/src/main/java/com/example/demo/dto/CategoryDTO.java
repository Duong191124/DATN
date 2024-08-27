package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;


@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Data
@Builder
public class CategoryDTO {
    @NotBlank(message = "Name can't empty")
    private String name;
}
