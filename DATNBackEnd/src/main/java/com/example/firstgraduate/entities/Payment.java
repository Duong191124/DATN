package com.example.firstgraduate.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Entity
@Table(name = "payment")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Getter @Setter
public class Payment {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id", nullable = false)
    private int id;
    @Basic
    @Column(name = "payment_date", nullable = true)
    private Date paymentDate;
    @Basic
    @Column(name = "payment_method", nullable = true, length = 50)
    private String paymentMethod;
    @Basic
    @Column(name = "amount", nullable = true)
    private Integer amount;
    @ManyToOne
    @JoinColumn(name = "order_id", referencedColumnName = "id")
    private Orders orders;
}
