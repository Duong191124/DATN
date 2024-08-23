package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Set;


@Entity
@Table(name = "promotion")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Getter @Setter
public class Promotion extends BaseEntity {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id", nullable = false)
    private int id;
    @Basic
    @Column(name = "name", nullable = true, length = 255)
    private String name;
    @Basic
    @Column(name = "description", nullable = true, length = 255)
    private String description;
    @Basic
    @Column(name = "start_date", nullable = true)
    private LocalDateTime startDate;
    @Basic
    @Column(name = "end_date", nullable = true)
    private LocalDateTime endDate;
    @Basic
    @Column(name = "discount_percent", nullable = true, length = 255)
    private String discountPercent;
    @Basic
    @Column(name = "discount_amount", nullable = true, length = 255)
    private String discountAmount;
    @Basic
    @Column(name = "status")
    private int status;
    @ManyToMany(mappedBy = "promotions")
    private Set<ProductDetail> productDetails;
}
