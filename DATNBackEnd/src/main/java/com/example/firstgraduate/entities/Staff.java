package com.example.firstgraduate.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;


@Entity
@Table(name = "staff")
@AllArgsConstructor
@NoArgsConstructor
@Getter @Setter
public class Staff extends BaseEntity {
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
    @Column(name = "date_of_birth", nullable = true)
    private Date dateOfBirth;
    @Basic
    @Column(name = "email", nullable = true, length = 50)
    private String email;
    @Basic
    @Column(name = "address", nullable = true, length = 255)
    private String address;
    @Basic
    @Column(name = "salary", nullable = true, precision = 0)
    private Double salary;
    @Basic
    @Column(name = "hire_date", nullable = true)
    private Date hireDate;
    @Basic
    @Column(name = "status")
    private int status;
    @Basic
    @Column(name = "notes", nullable = true, length = 255)
    private String notes;
    @ManyToOne
    @JoinColumn(name = "account_id", referencedColumnName = "id")
    private Account account;
}
