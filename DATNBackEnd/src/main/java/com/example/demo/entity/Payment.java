package com.example.demo.entity;

import jakarta.persistence.*;

import java.sql.Date;
import java.util.Objects;

@Entity
public class Payment {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private int id;
    @Basic
    @Column(name = "payment_date")
    private Date paymentDate;
    @Basic
    @Column(name = "payment_method")
    private String paymentMethod;
    @ManyToOne
    @JoinColumn(name = "order_id", referencedColumnName = "id")
    private Orders ordersByOrderId;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Date getPaymentDate() {
        return paymentDate;
    }

    public void setPaymentDate(Date paymentDate) {
        this.paymentDate = paymentDate;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Payment payment = (Payment) o;
        return id == payment.id && Objects.equals(paymentDate, payment.paymentDate) && Objects.equals(paymentMethod, payment.paymentMethod);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, paymentDate, paymentMethod);
    }

    public Orders getOrdersByOrderId() {
        return ordersByOrderId;
    }

    public void setOrdersByOrderId(Orders ordersByOrderId) {
        this.ordersByOrderId = ordersByOrderId;
    }
}
