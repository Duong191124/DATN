package com.example.firstgraduate.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.Collection;
import java.util.Objects;

@Entity
@Table(name = "category")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Getter @Setter
public class Category {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id", nullable = false)
    private int id;
    @Basic
    @Column(name = "name", nullable = true, length = 255)
    private String name;

}
