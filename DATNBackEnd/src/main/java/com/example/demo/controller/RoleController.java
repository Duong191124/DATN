package com.example.demo.controller;

import com.example.demo.entity.Role;
import com.example.demo.response.MessageReponse;
import com.example.demo.service.impl.RoleServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${api.prefix}/role")
public class RoleController {
    @Autowired
    RoleServiceImpl roleService;

    @GetMapping("")
    public ResponseEntity<?> getAllRoles(){
        try {
            return ResponseEntity.status(HttpStatus.OK).body(MessageReponse.builder()
                    .message("Get all roles successfully")
                    .status(HttpStatus.OK.value())
                    .data(roleService.getAll())
                    .build());
        }catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(MessageReponse.builder()
                    .message("Error: " + e.getMessage())
                    .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                    .build());
        }
    }

    @PostMapping("")
    public ResponseEntity<?> addRole(@Validated @RequestBody Role role){
        try {
            Role newRole = roleService.save(role);
            return ResponseEntity.status(HttpStatus.CREATED).body(MessageReponse.builder()
                    .message("Add role successfully")
                    .status(HttpStatus.CREATED.value())
                    .data(newRole)
                    .build());
        }catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(MessageReponse.builder()
                    .message("Error: " + e.getMessage())
                    .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                    .build());
        }
    }

    @PatchMapping("")
    public ResponseEntity<?> updateRole(@Validated @RequestBody Role role){
        try {
            roleService.save(role);
            return ResponseEntity.status(HttpStatus.OK).body(MessageReponse.builder()
                    .message("Update role successfully")
                    .status(HttpStatus.OK.value())
                    .data(role)
                    .build());
        }catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(MessageReponse.builder()
                    .message("Error: " + e.getMessage())
                    .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                    .build());
        }
    }

    @DeleteMapping("{id}")
    public ResponseEntity<?> deleteRole(@PathVariable Integer id){
        try {
            roleService.deleteById(id);
            return ResponseEntity.status(HttpStatus.OK).body(MessageReponse.builder()
                    .message("Delete role with id = " + id + " successfully")
                    .status(HttpStatus.OK.value())
                    .build());
        }catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(MessageReponse.builder()
                    .message("Error: " + e.getMessage())
                    .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                    .build());
        }
    }

    @GetMapping("/getRoleById/{id}")
    public ResponseEntity<?> getRoleById(@PathVariable Integer id){
        try {
            Role role = roleService.getById(id);
            return ResponseEntity.status(HttpStatus.OK).body(MessageReponse.builder()
                    .message("Get role with id = " + id + " successfully")
                    .status(HttpStatus.OK.value())
                    .data(role)
                    .build());
        }catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(MessageReponse.builder()
                    .message("Error: " + e.getMessage())
                    .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                    .build());
        }
    }
}
