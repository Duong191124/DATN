package com.example.demo.controller;

import com.example.demo.dto.AddressDTO;
import com.example.demo.dto.AddressUpdateDTO;
import com.example.demo.entity.Address;
import com.example.demo.response.AddressResponse;
import com.example.demo.response.MessageReponse;
import com.example.demo.service.AddressService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.prefix}/address")
public class AddressController {
    @Autowired
    private AddressService addressService;
    @PreAuthorize("hasAuthority('READ_ADDRESS')")
    @GetMapping("{customerId}")
    public ResponseEntity<MessageReponse> getAll(@PathVariable Integer customerId) {
        List<Address> addressList = addressService.getAddressList(customerId);
        return ResponseEntity.status(HttpStatus.OK).body(MessageReponse.builder()
                .message("Lay thong tin thanh cong")
                .status(HttpStatus.OK.value())
                .data(addressList)
                .build());
    }
    @PreAuthorize("hasAuthority('CREATE_ADDRESS')")
    @PostMapping("")
    public ResponseEntity<MessageReponse> add(@Valid @RequestBody AddressDTO addressDTO, BindingResult result) {
        if (result.hasErrors()) {
            List<String> errorMessage = result.getFieldErrors()
                    .stream()
                    .map(FieldError::getDefaultMessage)
                    .toList();
            return ResponseEntity.badRequest().body(MessageReponse.builder()
                    .message(errorMessage.toString())
                    .status(HttpStatus.BAD_REQUEST.value())
                    .build());
        }
        Address newAddress = addressService.add(addressDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(MessageReponse.builder()
                .message("create address success")
                .status(HttpStatus.CREATED.value())
                .data(newAddress)
                .build());
    }
    @PreAuthorize("hasAuthority('UPDATE_ADDRESS')")
    @PutMapping("{id}")
    public ResponseEntity<?> update(
            @PathVariable("id") Integer id,
            @RequestBody AddressUpdateDTO addressUpdateDTO) throws Exception {
        Address updateAddress = addressService.update(id, addressUpdateDTO);
        return ResponseEntity.status(HttpStatus.OK).body(MessageReponse.builder()
                .message("update brand success")
                .status(HttpStatus.OK.value())
                .data(updateAddress)
                .build());
    }
    @PreAuthorize("hasAuthority('DELETE_ADDRESS')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBrand(@PathVariable("id") Integer id) {
        try {
            addressService.deleteAddress(id);
            return ResponseEntity.status(HttpStatus.OK).body(MessageReponse.builder()
                    .message("delete brand successfully")
                    .status(HttpStatus.OK.value())
                    .build());

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());

        }
    }
}
