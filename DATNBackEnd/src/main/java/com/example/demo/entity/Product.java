package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.*;


@Entity
@Table(name = "product")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter @Setter
public class Product extends BaseEntity {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private Integer id;
    @Basic
    @Column(name = "code", nullable = true, length = 255)
    private String code;
    @Basic
    @Column(name = "name", nullable = true, length = 255)
    private String name;
    @Basic
    @Column(name = "image", nullable = true, length = 255)
    private String image;
    @Basic
    @Column(name = "price", nullable = true, precision = 0)
    private Double price;
    @ManyToOne
    @JoinColumn(name = "collar_id", referencedColumnName = "id")
    private Collar collar;
    @ManyToOne
    @JoinColumn(name = "sleeve_id", referencedColumnName = "id")
    private Sleeve sleeve;
    @Basic
    @Column(name = "description", nullable = true, length = 255)
    private String description;
    @ManyToOne
    @JoinColumn(name = "category_id", referencedColumnName = "id")
    private Category category;
    @ManyToOne
    @JoinColumn(name = "brand_id", referencedColumnName = "id")
    private Brand brand;
}
