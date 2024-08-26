package com.example.demo.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductDetailDTO {

    @NotNull(message = "Code is required")
    @Size(max = 255, message = "Code cannot exceed 255 characters")
    private String code;

    @NotNull(message = "Quantity is required")
    @Min(value = 0, message = "Quantity must be at least 0")
    private int quantity;

    @NotNull(message = "Price is required")
    @Positive(message = "Price must be greater than 0")
    private double price;

    @Size(max = 255, message = "Image path cannot exceed 255 characters")
    private String image;

    @NotNull(message = "Product is required")
    private int productId;

    @NotNull(message = "Size is required")
    private int sizeId;

    @NotNull(message = "Color is required")
    private int colorId;

}
