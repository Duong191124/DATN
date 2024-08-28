package com.example.demo.dto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Data
@Builder
public class SizeDTO {

    private String code;

    private String name;

    private byte status;
}
