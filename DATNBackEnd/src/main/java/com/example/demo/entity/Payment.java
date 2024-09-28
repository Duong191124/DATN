package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.Date;

@Entity
@Table(name = "payment")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@Getter @Setter
public class Payment {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id", nullable = false)
    private Integer id;
    @Basic
    @Column(name = "payment_date", nullable = true)
    private Date paymentDate;
    @Basic
    @Column(name = "payment_method", nullable = true, length = 50)
    private String paymentMethod;
    @ManyToOne
    @JoinColumn(name = "order_id", referencedColumnName = "id")
    private Orders orders;
}
