package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Set;


@Entity
@Table(name = "voucher")
@AllArgsConstructor
@NoArgsConstructor
@Getter @Setter
@Builder
public class  Voucher extends BaseEntity {
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
    @Column(name = "discount_amount", nullable = true, length = 255)
    private String discountAmount;
    @Basic
    @Column(name = "discount_percent", nullable = true, length = 255)
    private String discountPercent;
    @Basic
    @Column(name = "expiration_date", nullable = true)
    private LocalDateTime expirationDate;
    @Basic
    @Column(name = "min_purchase_amount", nullable = true, length = 255)
    private String minPurchaseAmount;
    @Basic
    @Column(name = "max_discount_amount", nullable = true, length = 255)
    private String maxDiscountAmount;
    @Basic
    @Column(name = "terms_and_conditions", nullable = true, length = 255)
    private String termsAndConditions;
    @Basic
    @Column(name = "status")
    private int status;
    @ManyToMany(fetch = FetchType.EAGER) // Loại bỏ cascade
    @JoinTable(
            name = "customer_voucher", // Tên bảng trung gian
            joinColumns = @JoinColumn(name = "voucher_id"), // Khóa ngoại tới bảng Promotion
            inverseJoinColumns = @JoinColumn(name = "customer_id") // Khóa ngoại tới bảng ProductDetail
    )
    private Set<Customer> customers;
}