package com.example.firstgraduate.entities;

import jakarta.persistence.*;
import lombok.*;


@Entity
@Table(name = "brand")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Getter @Setter
public class Brand {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id", nullable = false)
    private int id;
    @Basic
    @Column(name = "code", nullable = true, length = 255)
    private String code;
    @Basic
    @Column(name = "name", nullable = true, length = 255)
    private String name;
    @Basic
    @Column(name = "status")
    private byte status;

}
