package com.example.demo.dto;

import lombok.*;

import javax.validation.constraints.*;

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
