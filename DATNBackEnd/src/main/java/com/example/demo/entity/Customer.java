package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.ServiceLoader;
import java.util.Set;

@Entity
@Table(name = "customer")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Customer extends BaseEntity {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private int id;
    @Basic
    @Column(name = "username")
    private String username;
    @Basic
    @Column(name = "password")
    private String password;
    @Basic
    @Column(name = "email")
    private String email;
    @Basic
    @Column(name = "address")
    private String address;
    @Basic
    @Column(name = "phone_number")
    private String phoneNumber;
    @Basic
    @Column(name = "status")
    private int status;
    @Basic
    @Column(name = "date_of_birth")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    private LocalDateTime dateOfBirth;
    @Basic
    @Column(name = "name")
    private String name;
    @Basic
    @Column(name = "notes")
    private String notes;
    @Basic
    @Column(name = "gender")
    private int gender;
    @ManyToMany(fetch = FetchType.EAGER) // Loại bỏ cascade
    @JoinTable(
            name = "customer_voucher", // Tên bảng trung gian
            joinColumns = @JoinColumn(name = "customer_id"), // Khóa ngoại tới bảng Promotion
            inverseJoinColumns = @JoinColumn(name = "voucher_id") // Khóa ngoại tới bảng ProductDetail
    )
    private Set<Voucher> vouchers;

}
