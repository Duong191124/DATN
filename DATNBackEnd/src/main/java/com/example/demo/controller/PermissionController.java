package com.example.demo.controller;

import com.example.demo.entity.Permission;
import com.example.demo.response.MessageReponse;
import com.example.demo.service.PermissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("${api.prefix}/permission")
public class PermissionController {
    @Autowired
    PermissionService permissionService;
    @GetMapping("/getAll")
    public ResponseEntity<MessageReponse> getAllPermition(
            @RequestParam(name = "page", defaultValue = "1")int page,
            @RequestParam(name = "size", defaultValue = "10")int size
    ){
        Pageable pageable = PageRequest.of(page-1, size);
        try {
            return ResponseEntity.ok().body(
                    MessageReponse.builder()
                            .message("get all permission sucessfully")
                            .status(HttpStatus.OK.value())
                            .data(permissionService.getAll(pageable))
                            .build()
            );
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(
                    MessageReponse.builder()
                            .message(e.getMessage())
                            .status(HttpStatus.NO_CONTENT.value())
                            .data(null)
                            .build()
            );
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<MessageReponse> getById(@PathVariable("id")int id){
        try{
            return ResponseEntity.ok().body(
                    MessageReponse.builder()
                            .data(permissionService.getById(id))
                            .status(HttpStatus.OK.value())
                            .message("get permission by id successfully")
                            .build()
            );
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    MessageReponse.builder()
                            .status(HttpStatus.BAD_REQUEST.value())
                            .message(e.getMessage())
                            .data(null)
                            .build()
            );
        }
    }

    @PostMapping("/")
    public ResponseEntity<MessageReponse> createNew(@Validated @RequestBody Permission permission, BindingResult result){
        try {
            if(result.hasErrors()){
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                        MessageReponse.builder()
                                .status(HttpStatus.BAD_REQUEST.value())
                                .message(result.getFieldError().toString())
                                .data(null)
                                .build()
                );
            }
            return ResponseEntity.ok().body(
                    MessageReponse.builder()
                            .status(HttpStatus.OK.value())
                            .data(permissionService.save(permission))
                            .message("Create new permission successfully")
                            .build()

            );
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(
                    MessageReponse.builder()
                            .status(HttpStatus.NO_CONTENT.value())
                            .message(e.getMessage())
                            .data(null)
                            .build()
            );
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<MessageReponse> deleteById(@PathVariable("id")int id){
        try{
            permissionService.deleteById(id);
            return ResponseEntity.ok().body(
                    MessageReponse.builder()
                            .data("Delete ok")
                            .message("Delete sucessfully")
                            .build()
            );
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(
                    MessageReponse.builder()
                            .status(HttpStatus.NO_CONTENT.value())
                            .message(e.getMessage())
                            .data(null)
                            .build()
            );
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<MessageReponse> updateById(@PathVariable("id")int id, @Validated @RequestBody Permission permission, BindingResult result){
        try{
            if(result.hasErrors()){
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                        MessageReponse.builder()
                                .status(HttpStatus.BAD_REQUEST.value())
                                .message(result.getFieldError().toString())
                                .data(null)
                                .build()
                );
            }
            Permission oldPermission = permissionService.getById(id);
            oldPermission.setName(permission.getName());
            permissionService.save(oldPermission);
            return ResponseEntity.ok().body(
                    MessageReponse.builder()
                            .data(oldPermission)
                            .message("update sucessfully")
                            .build()
            );
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    MessageReponse.builder()
                            .status(HttpStatus.BAD_REQUEST.value())
                            .message(e.getMessage())
                            .data(null)
                            .build()
            );
        }
    }

}
