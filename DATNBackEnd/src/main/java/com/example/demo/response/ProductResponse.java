package com.example.demo.response;

import com.example.demo.entity.Product;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductResponse {
    private Integer id;
    private String code;
    private String name;
    private String image;
    private int status;
    private String collarName;
    private String sleeveName;
    private String description;
    private String categoryName;
    private String brandName;
    private LocalDateTime createdAt;
    public static ProductResponse convertResponse(Product product){
        return ProductResponse.builder()
                .id(product.getId())
                .code(product.getCode())
                .name(product.getName())
                .image(product.getImage())
                .status(product.getStatus())
                .collarName(product.getCollar().getName())
                .sleeveName(product.getSleeve().getName())
                .description(product.getDescription())
                .categoryName(product.getCategory().getName())
                .brandName(product.getBrand().getName())
                .createdAt(product.getCreatedAt())
                .build();
    }
}
