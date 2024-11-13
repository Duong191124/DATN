package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.*;


@Entity
@Table(name = "cart_detail")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Getter @Setter
@Builder
public class CartDetail {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id", nullable = false)
    private int id;
    @Basic
    @Column(name = "quantity")
    private int quantity;
    @Basic
    @Column(name = "price", nullable = true, precision = 0)
    private Double price;
    @Basic
    @Column(name = "total_price", nullable = true, precision = 0)
    private Double totalPrice;
    @OneToOne
    @JoinColumn(name = "customer_id", referencedColumnName = "id")
    private Customer customer;
    @ManyToOne
    @JoinColumn(name = "product_detail_id", referencedColumnName = "id")
    private ProductDetail productDetail;

    @PrePersist
    @PreUpdate
    private void calculateTotalPrice() {
        if (this.price != null && this.quantity > 0) {
            this.totalPrice = this.price * this.quantity;
        } else {
            this.totalPrice = 0.0;
        }
    }
}

