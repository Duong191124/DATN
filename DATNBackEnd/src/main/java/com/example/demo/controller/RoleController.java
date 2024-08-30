package com.example.demo.controller;

import com.example.demo.entity.Role;
import com.example.demo.response.MessageReponse;
<<<<<<< HEAD
import com.example.demo.service.impl.RoleServiceImpl;
=======
import com.example.demo.service.RoleService;
>>>>>>> 20be25b1403d69c969009ba98fdc54c3d8736ec4
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${api.prefix}/role")
public class RoleController {
    @Autowired
<<<<<<< HEAD
    RoleServiceImpl roleService;

    @GetMapping("")
=======
    RoleService roleService;

    @GetMapping("/getAllRoles")
>>>>>>> 20be25b1403d69c969009ba98fdc54c3d8736ec4
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

<<<<<<< HEAD
    @PostMapping("")
=======
    @PostMapping("/create")
>>>>>>> 20be25b1403d69c969009ba98fdc54c3d8736ec4
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

<<<<<<< HEAD
    @PatchMapping("")
=======
    @PatchMapping("/update")
>>>>>>> 20be25b1403d69c969009ba98fdc54c3d8736ec4
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

<<<<<<< HEAD
    @DeleteMapping("{id}")
=======
    @DeleteMapping("/delete/{id}")
>>>>>>> 20be25b1403d69c969009ba98fdc54c3d8736ec4
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
