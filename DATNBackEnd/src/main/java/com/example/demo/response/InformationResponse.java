package com.example.demo.response;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class InformationResponse {
    private int id;
    private String name;
    private String email;
    private String phoneNumber;
}
