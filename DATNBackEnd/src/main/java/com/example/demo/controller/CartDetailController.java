package com.example.demo.controller;

import com.example.demo.dto.CartDetailDTO;
import com.example.demo.response.CartDetailResponse;
import com.example.demo.response.MessageReponse;
import com.example.demo.service.impl.CartDetailServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.prefix}/cartDetail")
@RequiredArgsConstructor
public class CartDetailController {
    private final CartDetailServiceImpl cartDetailService;

    @GetMapping("{customerId}")
    public ResponseEntity<MessageReponse> getAll(@PathVariable("customerId") int customerId){
        List<CartDetailResponse> cartDetailList = cartDetailService.getAll(customerId)
                .stream()
                .map(CartDetailResponse::fromCartDetailResponse)
                .toList();
        return ResponseEntity.ok().body(MessageReponse.builder()
                .message("lay du lieu thanh cong")
                .status(HttpStatus.OK.value())
                .data(cartDetailList)
                .build());
    }
//    @PreAuthorize("hasAuthority('CREATE_CART_DETAIL')")
    @PostMapping("")
    public ResponseEntity<MessageReponse> add(
            @Valid @RequestBody CartDetailDTO cartDetailDTO,
            BindingResult result) throws Exception {
        if (result.hasErrors()){
            List<String> errorMessage = result.getFieldErrors()
                    .stream()
                    .map(FieldError::getDefaultMessage)
                    .toList();
            return ResponseEntity.badRequest().body(MessageReponse.builder()
                    .message(errorMessage.toString())
                    .status(HttpStatus.BAD_REQUEST.value())
                    .build());
        }
        CartDetailResponse cartDetail = cartDetailService.add(cartDetailDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(MessageReponse.builder()
                .message("them thanh cong")
                .status(HttpStatus.CREATED.value())
                .data(cartDetail)
                .build());

    }
//    @PreAuthorize("hasAuthority('UPDATE_CART_DETAIL')")
    @PutMapping("{id}")
    public ResponseEntity<?> update(
            @PathVariable("id") Integer id,
            @RequestBody CartDetailDTO cartDetailDTO
    )throws Exception{
        CartDetailResponse updateCartDetail =  cartDetailService.update(id,cartDetailDTO);
        return ResponseEntity.ok().body(MessageReponse.builder()
                .message("sua thanh cong")
                .status(HttpStatus.OK.value())
                .data(updateCartDetail)
                .build());
    }
    @PreAuthorize("hasAuthority('DELETE_CART_DETAIL')")
    @DeleteMapping("{id}")
    public ResponseEntity<?> delete(@PathVariable("id") Integer id)throws Exception{
        cartDetailService.delete(id);
        return ResponseEntity.ok().body(MessageReponse.builder()
                .message("xoa thanh cong voi id ="+id)
                .status(HttpStatus.OK.value())
                .build());
    }
}
