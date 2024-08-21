package com.example.firstgraduate.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.Objects;

@Entity
@Table(name = "cart_detail")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Getter @Setter
public class CartDetail {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id", nullable = false)
    private int id;
    @Basic
    @Column(name = "quantity", nullable = true, length = 255)
    private String quantity;
    @Basic
    @Column(name = "price", nullable = true, precision = 0)
    private Double price;
    @Basic
    @Column(name = "total_price", nullable = true, precision = 0)
    private Double totalPrice;
    @ManyToOne
    @JoinColumn(name = "customer_id", referencedColumnName = "id")
    private Customer customer;
    @ManyToOne
    @JoinColumn(name = "product_id", referencedColumnName = "id")
    private Product product;
    @ManyToOne
    @JoinColumn(name = "order_id", referencedColumnName = "id")
    private Orders orders;

}
