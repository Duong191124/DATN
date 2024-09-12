package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.Set;


@Entity
@Table(name = "product_detail")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Getter @Setter
public class ProductDetail extends BaseEntity {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id", nullable = false)
    private int id;
    @Basic
    @Column(name = "code", nullable = true, length = 255)
    private String code;
    @Basic
    @Column(name = "quantity", nullable = true, length = 255)
    private int quantity;
    @Basic
    @Column(name = "price", nullable = true, precision = 0)
    private Double price;
    @Basic
    @Column(name = "image", nullable = true, length = 255)
    private String image;
    @ManyToOne
    @JoinColumn(name = "product_id", referencedColumnName = "id")
    private Product product;
    @ManyToOne
    @JoinColumn(name = "size_id", referencedColumnName = "id")
    private Size size;
    @ManyToOne
    @JoinColumn(name = "color_id", referencedColumnName = "id")
    private Color color;
    @ManyToMany
    @JoinTable(
            name = "product_promotion",
            joinColumns = @JoinColumn(name = "product_detail_id"),
            inverseJoinColumns = @JoinColumn(name = "promotion_id")
    )
    private Set<Promotion> promotions;
}
