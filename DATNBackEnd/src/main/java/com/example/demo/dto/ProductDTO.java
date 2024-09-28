package com.example.demo.dto;

import com.example.demo.entity.*;

import com.example.demo.repository.BrandRepo;
import com.example.demo.repository.CategoryRepo;
import com.example.demo.repository.CollarRepo;
import com.example.demo.repository.SleeveRepo;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDTO {
    private Integer id;
    @NotBlank(message = "check the product code, please!")
    private String code;
    @NotBlank (message = "check the product name, please!")
    private String name;
    private String image;
    @Min(value = 0,message = "price not valid!")
    @NotNull(message = "check the product price,please!")
    private Double price;
    @NotBlank(message = "check the product collar name, please!")
    private String collarName;
    @NotBlank(message = "check the product sleeve name, please!")
    private String sleeveName;
    @NotBlank(message = "check the product description , please!")
    private String description;
    @NotBlank(message = "check the product category name, please!")
    private String categoryName;
    @NotBlank(message = "check the product brand name, please!")
    private String brandName;


    public static Product convertProduct(ProductDTO productDTO, CategoryRepo categoryRepo, BrandRepo brandRepo, CollarRepo collarRepo, SleeveRepo sleeveRepo) {
        String imageUrl = "";
        Brand brand = brandRepo.findByName(productDTO.getBrandName())
                .orElseThrow(()->new RuntimeException("Not found brand with name"+productDTO.getBrandName()));
        Category category = categoryRepo.findByName(productDTO.getCategoryName())
                .orElseThrow(()->new RuntimeException("Not found category with name"+productDTO.getCategoryName()));
        Collar collar = collarRepo.findByName(productDTO.getCollarName())
                .orElseThrow(()->new RuntimeException("Not found collar with name"+productDTO.getCollarName()));
        Sleeve sleeve = sleeveRepo.findByName(productDTO.getSleeveName())
                .orElseThrow(()->new RuntimeException("Not found sleeve with name"+productDTO.getSleeveName()));
        return Product.builder()
                .id(productDTO.getId())
                .code(productDTO.getCode())
                .name(productDTO.getName())
                .image(imageUrl)
                .price(productDTO.getPrice())
                .collar(collar)
                .sleeve(sleeve)
                .description(productDTO.getDescription())
                .category(category)
                .brand(brand)
                .build();
    }

}
