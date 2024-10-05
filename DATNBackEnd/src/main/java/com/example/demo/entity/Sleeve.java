package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.*;

<<<<<<< HEAD
@Entity
@Table(name = "sleeve")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
=======
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "sleeve")
>>>>>>> 2737feb9f6b602c7b2f4ffe0782eb9372e6c60e0
public class Sleeve {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id", nullable = false)
    private int id;
    @Basic
<<<<<<< HEAD
    @Column(name = "code", nullable = true, length = 255)
    private String code;
    @Basic
    @Column(name = "name", nullable = true, length = 255)
=======
    @Column(name = "code", nullable = false, length = 255)
    private String code;
    @Basic
    @Column(name = "name", nullable = false, length = 255)
>>>>>>> 2737feb9f6b602c7b2f4ffe0782eb9372e6c60e0
    private String name;
    @Basic
    @Column(name = "status")
    private int status;
}
