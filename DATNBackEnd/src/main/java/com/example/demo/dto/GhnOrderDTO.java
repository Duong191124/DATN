package com.example.demo.dto;

import com.example.demo.entity.ProductDetail;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class GhnOrderDTO {
    @Min(value = 1, message = "District ID must be greater than 0")
    private int toDistrictId;

    @NotBlank(message = "Ward code cannot be blank")
    private String toWardCode;

    @Min(value = 1, message = "Weight must be greater than 0")
    private int weight;

    @Min(value = 1, message = "Payment type must be 2 (user) or 1 (saler)")
    @Max(value = 2, message = "Payment type must be 2 (user) or 1 (saler)")
    private int paymentType;

    @Min(value = 0, message = "COD value must be 0 or greater")
    private int shipCOD;

    @NotBlank(message = "Customer name cannot be blank")
    @Size(max = 50, message = "Customer name must be less than 50 characters")
    private String customerName;

    @NotBlank(message = "Customer phone cannot be blank")
    @Pattern(regexp = "^\\+?[0-9]{10,15}$", message = "Invalid phone number")
    private String customerPhone;

    @NotBlank(message = "Address detail cannot be blank")
    private String addressDetail;

    @Email(message = "Invalid email address")
    private String customerEmail;

    @NotEmpty(message = "Product items cannot be empty")
    private List<ProductDetail> items;
}
