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
    @NotNull(message = "weight khong duoc de trong")
    private int weight_value;

    @NotNull(message = "trang thai khong duoc de trong")
    private int status;

}
