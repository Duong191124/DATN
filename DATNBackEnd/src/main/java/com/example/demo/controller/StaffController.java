package com.example.demo.controller;

import com.example.demo.dto.StaffDTO;
import com.example.demo.dto.UserPermissionDTO;
import com.example.demo.entity.Staff;
import com.example.demo.response.CustomerResponse;
import com.example.demo.response.MessageReponse;
import com.example.demo.service.impl.StaffServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("${api.prefix}/staff")
@RequiredArgsConstructor
public class StaffController {

    private final StaffServiceImpl staffService;

//    @GetMapping("/staffListByOrder")
//    public ResponseEntity<?> getAllStaff(){
//        Pageable pageable = PageRequest.of(page-1, size);
//        return ResponseEntity.ok().body(MessageReponse.builder()
//                .message("lay thong tin thanh cong")
//                .status(HttpStatus.OK.value())
//                .data(staffService.getAll(pageable))
//                .build()
//        );
//    }
    @GetMapping("/getAll")
    public ResponseEntity<MessageReponse> getAll(
            @RequestParam(name = "username", required = false) String username,
            @RequestParam(name = "phoneNumber", required = false) String phoneNumber,
            @RequestParam(name = "page", defaultValue = "1")int page,
            @RequestParam(name = "size", defaultValue = "10")int size
    ){
        Pageable pageable = PageRequest.of(page - 1, size);

        try {
            Page<Staff> staffPage = staffService.searchByUsernameAndPhoneNumber(username, phoneNumber, pageable);
            return ResponseEntity.ok().body(MessageReponse.builder()
                    .message("Search completed successfully")
                    .status(HttpStatus.OK.value())
                    .data(staffPage)
                    .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    MessageReponse.builder()
                            .status(HttpStatus.BAD_REQUEST.value())
                            .message(e.getMessage())
                            .data(null)
                            .build()
            );
        }
    }

    @PostMapping("/register")
    public ResponseEntity<MessageReponse> createStaff(
            @Validated
            @RequestBody StaffDTO staffDTO,
            BindingResult result
    ){
        if(result.hasErrors()){
            List<String> errorMessage = result.getFieldErrors()
                    .stream()
                    .map(FieldError::getDefaultMessage)
                    .toList();
            return ResponseEntity.badRequest().body(MessageReponse.builder()
                    .message(errorMessage.toString())
                    .status(HttpStatus.BAD_REQUEST.value())
                    .build()
            );
        }
            Staff newStaff = staffService.save(staffDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(MessageReponse.builder()
                    .message("register successfully")
                    .status(HttpStatus.OK.value())
                    .data(newStaff)
                    .build()
            );


    }
    @PreAuthorize("hasAuthority('UPDATE_STAFF')")
    @PutMapping("/update-status/{id}")
    public ResponseEntity<?> updateStaff(@PathVariable("id") Integer id){
        String updateStatus = staffService.updateStatus(id);
        return ResponseEntity.ok().body(MessageReponse.builder()
                .message(updateStatus)
                .status(HttpStatus.OK.value())
                .build());
    }
    @PreAuthorize("hasAuthority('DELETE_STAFF')")
    @PutMapping("/soft-delete/{id}")
    public ResponseEntity<?> delete(@PathVariable("id") Integer id)throws Exception{
        String delete = staffService.softDelete(id);
        return ResponseEntity.ok().body(MessageReponse.builder()
                .message(delete)
                .status(HttpStatus.OK.value())
                .build());
    }
    @GetMapping("/{id}")
    public ResponseEntity<MessageReponse> getById(@PathVariable("id")int id){
        try{
            return ResponseEntity.ok().body(
                    MessageReponse.builder()
                            .data(staffService.getById(id).getPermission())
                            .status(HttpStatus.OK.value())
                            .message("get staff by id successfully")
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
//    @PreAuthorize("hasAuthority('UPDATE_PERMISSION')")
    @PutMapping("/{staffId}/update-permission")
    public ResponseEntity<?> updatePermissions(
            @PathVariable Integer staffId,
            @RequestBody UserPermissionDTO permissionDTO) {
        try {
            // Cập nhật quyền
            staffService.updatePermissions(staffId, permissionDTO);

            // Hủy token của user khi quyền đã được thay đổi
            staffService.invalidateToken(staffId); // Đây là phương thức hủy token

            // Thông báo thành công và yêu cầu đăng nhập lại
            return ResponseEntity.ok(Map.of(
                    "message", "Permissions updated. Please log in again.",
                    "status", 200
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "An error occurred.", "error", e.getMessage()));
        }
    }

//    @GetMapping("/{id}")
//    public ResponseEntity<?> findStaffById(@PathVariable Integer id){
//        try {
//            Staff staff = staffService.getById(id);
//            return ResponseEntity.ok(new MessageReponse("find staff with id: "+id+" successfully",200,StaffResponse.fromStaffResponse(staff)));
//        }catch (Exception e){
//            return ResponseEntity.badRequest().body(e.getMessage());
//        }
//    }
}
