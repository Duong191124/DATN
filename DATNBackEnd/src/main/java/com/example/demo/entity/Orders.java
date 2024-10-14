package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;


@Entity
@Table(name = "orders")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Orders extends BaseEntity {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id", nullable = false)
    private Integer id;
    @Basic
    @Column(name = "code")
    private String code;
    @Basic
    @Column(name = "status", nullable = true, length = 255)
    @Enumerated(EnumType.STRING)
    private OrderStatus status;
    @Basic
    @Column(name = "order_date", nullable = true)
    private Date orderDate;
    @Basic
    @Column(name = "delivery_fee", nullable = true, precision = 0)
    private Double deliveryFee;
    @Basic
    @Column(name = "total_amount", nullable = true, precision = 0)
    private Double totalAmount;
    @Basic
    @Column(name = "money_received", nullable = true, precision = 0)
    private Double moneyReceived;
    @ManyToOne
    @JoinColumn(name = "voucher_id", referencedColumnName = "id",nullable = true)
    private Voucher voucher;
    @ManyToOne
    @JoinColumn(name = "staff_id", referencedColumnName = "id")
    private Staff staff;
    @OneToMany(mappedBy = "orders",cascade = CascadeType.ALL,orphanRemoval = true)
    private List<OrderDetail> orderDetails = new ArrayList<>();
    @OneToMany(mappedBy = "orders",cascade = CascadeType.ALL,orphanRemoval = true)
    private List<Payment> payments = new ArrayList<>();
}
