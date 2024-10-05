package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.*;

<<<<<<< HEAD
@Entity
@Table(name = "collar")
@AllArgsConstructor
@NoArgsConstructor
@Getter @Setter
@Builder
=======
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "collar")
>>>>>>> 2737feb9f6b602c7b2f4ffe0782eb9372e6c60e0
public class Collar {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id", nullable = false)
    private int id;
    @Basic
    @Column(name = "code", nullable = true, length = 255)
    private String code;
    @Basic
<<<<<<< HEAD
    @Column(name = "name", nullable = true, length = 255)
=======
    @Column(name = "name", nullable = false, length = 255)
>>>>>>> 2737feb9f6b602c7b2f4ffe0782eb9372e6c60e0
    private String name;
    @Basic
    @Column(name = "status")
    private int status;
}
