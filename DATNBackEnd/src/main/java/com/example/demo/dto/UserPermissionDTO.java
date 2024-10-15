package com.example.demo.dto;

import lombok.Data;

import java.util.List;

@Data
public class UserPermissionDTO {
    private List<Integer> permissionToAdd;
    private List<Integer> permissionToRemove;
}
