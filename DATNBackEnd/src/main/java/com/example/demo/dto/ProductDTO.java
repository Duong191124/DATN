package com.example.demo.dto;

import com.example.demo.entity.Brand;
import com.example.demo.entity.Category;
import com.example.demo.entity.Product;
import com.example.demo.repository.BrandRepo;
import com.example.demo.repository.CategoryRepo;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProductDTO {
    private int id;
    @NotBlank(message = "check code product, please!")
    private String code;
    @NotBlank (message = "check name product, please!")
    private String name;
    @NotBlank (message = "check image product, please!")
    private String image;
    @Min(value = 0,message = "price not valid!")
    @NotNull(message = "check price product,please!")
    private Double price;
    @NotBlank(message = "check collar product, please!")
    private String collar;
    @NotBlank(message = "check sleeve product, please!")
    private String sleeve;
    @NotBlank(message = "check description product, please!")
    private String description;
    private String categoryName;
    private String brandName;

    public static ProductDTO convertDTO(Product product){
        return ProductDTO.builder()
                .id(product.getId())
                .code(product.getCode())
                .name(product.getName())
                .image(product.getImage())
                .price(product.getPrice())
                .collar(product.getCollar())
                .sleeve(product.getSleeve())
                .description(product.getDescription())
                .categoryName(product.getCategory().getName())
                .brandName(product.getBrand().getName())
                .build();
    }

    public static Product convertProduct(ProductDTO productDTO, CategoryRepo categoryRepo, BrandRepo brandRepo) {
        Brand brand = brandRepo.findByName(productDTO.getBrandName())
                .orElse(Brand.builder().name(productDTO.getBrandName()).build());
        Category category = categoryRepo.findByName(productDTO.getCategoryName())
                .orElse(Category.builder().name(productDTO.getCategoryName()).build());
        return Product.builder()
                .id(productDTO.getId())
                .code(productDTO.getCode())
                .name(productDTO.getName())
                .image(productDTO.getImage())
                .price(productDTO.getPrice())
                .collar(productDTO.getCollar())
                .sleeve(productDTO.getSleeve())
                .description(productDTO.getDescription())
                .category(category)
                .brand(brand)
                .build();
    }

}
