package com.example.demo.response;

import lombok.*;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Data
public class AccountStatisticsResponse {
    private Long adminCount;
    private Long managerCount;
    private Long normalEmployeeCount;
    private Long customer;
}
