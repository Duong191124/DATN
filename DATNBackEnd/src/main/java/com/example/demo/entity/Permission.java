package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "permission")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@Getter @Setter
public class Permission {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id", nullable = false)
    private int id;
    @Basic
    @Column(name = "name", nullable = false, length = 255)
    private String name;
    @Basic
    @Column(name = "status", nullable = false)
    private int status;
//    @ManyToOne
//    @JoinColumn(name = "entity_id",referencedColumnName = "id")
//    private Entity entity;
}
