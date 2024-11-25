package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.*;


@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
@Entity
@Table(name = "product")
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

    @ManyToOne
    @JoinColumn(name = "collar_id", referencedColumnName = "id")
    private Collar collar;
    @ManyToOne
    @JoinColumn(name = "sleeve_id", referencedColumnName = "id")
    private Sleeve sleeve;
    @Basic
    @Column(name = "description", nullable = true, length = 255)
    private String description;
    @Basic
    @Column(name = "status")
    private int status;
    @ManyToOne
    @JoinColumn(name = "category_id", referencedColumnName = "id")
    private Category category;
    @ManyToOne
    @JoinColumn(name = "brand_id", referencedColumnName = "id")
    private Brand brand;

    @PostLoad
    public void updateStatusBasedOnRelatedEntities() {
        if (sleeve.getStatus() == 0 ||
                collar.getStatus() == 0 || brand.getStatus() == 0) {
            this.status = 0;
        }
    }
}
