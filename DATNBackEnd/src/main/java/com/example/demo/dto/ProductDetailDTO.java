package com.example.demo.dto;

import com.example.demo.entity.ProductDetail;
import jakarta.validation.constraints.*;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class ProductDetailDTO {

    @NotBlank(message = "Code is required")
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

//    @NotNull(message = "Product is required")
    private int productId;

    @NotNull(message = "Size is required")
    private int sizeId;

    @NotNull(message = "Color is required")
    private int colorId;

    public static ProductDetailDTO convertProductDetailDTO(ProductDetail productDetail){
        return ProductDetailDTO.builder()
                .code(productDetail.getCode())
                .price(productDetail.getPrice())
                .quantity(productDetail.getQuantity())
                .image(productDetail.getImage())
                .productId(productDetail.getProduct().getId())
                .colorId(productDetail.getColor().getId())
                .sizeId(productDetail.getSize().getId())
                .build();
    }
}
