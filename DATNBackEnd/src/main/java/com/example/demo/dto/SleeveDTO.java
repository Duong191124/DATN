package com.example.demo.dto;

import com.example.demo.entity.Sleeve;
import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Value;

@Getter
@Setter
@Data
@Builder
public class SleeveDTO {
    @NotBlank(message = "Sleeve code is not blank")
    private String code;
    @NotBlank(message = "Sleeve name is not blank")
    private String name;
    @Value("1")
    private int status;
    public static Sleeve convertCollar(SleeveDTO sleeveDTO){
        return Sleeve.builder()
                .code(sleeveDTO.getCode())
                .name(sleeveDTO.getName())
                .status(1)
                .build();
    }
}
