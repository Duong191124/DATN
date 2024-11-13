package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Data
@Builder
public class WeightDTO {
    @NotBlank(message = "ma khong duoc de trong")
    private String code;

    @NotBlank(message = "ten khong duoc de trong")
    private String name;

    @NotNull(message = "trang thai khong duoc de trong")
    private int status;

}
