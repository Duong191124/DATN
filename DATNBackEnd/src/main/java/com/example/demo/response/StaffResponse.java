package com.example.demo.response;

import com.example.demo.entity.Staff;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class StaffResponse {
    private int id;

    private String username;

    private String email;

    private String address;

    private String phoneNumber;

    private int status;

    private Date dateOfBirth;

    private String name;

    private String notes;

    private int gender;

    private Integer roleId;

    public static StaffResponse fromStaffResponse(Staff staff){
        Integer roleId = (staff.getPermission() != null) ? staff.getPermission().getId() : null;
        return StaffResponse
                .builder()
                .id(staff.getId())
                .username(staff.getUsername())
                .name(staff.getName())
                .phoneNumber(staff.getPhoneNumber())
                .gender(staff.getGender())
                .email(staff.getEmail())
                .address(staff.getAddress())
                .status(staff.getStatus())
                .dateOfBirth(staff.getDateOfBirth())
                .notes(staff.getNotes())
                .roleId(roleId)
                .build();
    }
}
