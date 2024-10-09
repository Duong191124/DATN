package com.example.demo.dto;

import com.example.demo.entity.Collar;
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
public class CollarDTO {
    @NotBlank(message = "Collar code is not blank")
    private String code;
    @NotBlank(message = "Collar name is not blank")
    private String name;
    @Value("1")
    private int status;

    public static Collar convertCollar(CollarDTO collarDTO){
        return Collar.builder()
                .code(collarDTO.getCode())
                .name(collarDTO.getName())
                .status(1)
                .build();
    }
}
