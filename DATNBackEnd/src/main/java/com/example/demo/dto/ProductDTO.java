package com.example.demo.dto;

import com.example.demo.entity.*;
import com.example.demo.repository.BrandRepo;
import com.example.demo.repository.CategoryRepo;
import com.example.demo.repository.CollarRepo;
import com.example.demo.repository.SleeveRepo;
import com.fasterxml.jackson.annotation.JsonProperty;
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
    @JsonProperty("collar_id")
    private Integer collarId;
    @JsonProperty("sleeve_id")
    private Integer sleeveId;
    @NotBlank(message = "check the product description , please!")
    private String description;
    @JsonProperty("category_id")
    private Integer categoryId;
    @JsonProperty("brand_id")
    private Integer brandId;


    public static Product convertProduct(ProductDTO productDTO, CategoryRepo categoryRepo, SleeveRepo sleeveRepo, CollarRepo collarRepo, BrandRepo brandRepo) {
        String imageUrl = "";
        Collar collar = collarRepo.findById(productDTO.getCollarId()).orElseThrow(()->new RuntimeException("not found collar's id:"+productDTO.getCollarId()));
        Sleeve sleeve = sleeveRepo.findById(productDTO.getSleeveId()).orElseThrow(()->new RuntimeException("not found sleeve's id:"+productDTO.getSleeveId()));
        Category category = categoryRepo.findById(productDTO.getCategoryId()).orElseThrow(()->new RuntimeException("not found category's id:"+productDTO.getCategoryId()));
        Brand brand = brandRepo.findById(productDTO.getBrandId()).orElseThrow(()->new RuntimeException("not found brand's id:"+productDTO.getBrandId()));
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
