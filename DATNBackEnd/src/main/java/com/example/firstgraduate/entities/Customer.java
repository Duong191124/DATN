package com.example.firstgraduate.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "customer")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Customer extends BaseEntity {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id", nullable = false)
    private int id;
    @Basic
    @Column(name = "name", nullable = true, length = 255)
    private String name;
    @Basic
    @Column(name = "phone_number", nullable = true, length = 20)
    private String phoneNumber;
    @Basic
    @Column(name = "gender")
    private int gender;
    @Basic
    @Column(name = "email", nullable = true, length = 50)
    private String email;
    @Basic
    @Column(name = "address", nullable = true, length = 255)
    private String address;
    @ManyToOne
    @JoinColumn(name = "account_id", referencedColumnName = "id")
    private Account account;

}
