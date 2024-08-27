package com.example.demo.dto;

import com.example.demo.entity.ProductDetail;
import jakarta.persistence.Basic;
import jakarta.persistence.Column;
import jakarta.persistence.ManyToMany;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Set;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Data
@Builder
public class PromotionDTO {

    private String name;

    private String description;

    private LocalDateTime startDate;

    private LocalDateTime endDate;

    private String discountPercent;

    private String discountAmount;

    private int status;
    
    private Set<ProductDetail> productDetails;

}
