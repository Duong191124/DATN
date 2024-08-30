package com.example.demo.entity;

import jakarta.persistence.*;

import java.sql.Timestamp;
import java.util.Objects;

@Entity
@Table(name = "order_detail", schema = "datn", catalog = "")
public class OrderDetail {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private int id;
    @Basic
    @Column(name = "price")
    private Double price;
    @Basic
    @Column(name = "quantity")
    private Integer quantity;
    @Basic
    @Column(name = "created_at")
    private Timestamp createdAt;
    @Basic
    @Column(name = "updated_at")
    private Timestamp updatedAt;
    @ManyToOne
    @JoinColumn(name = "order_id", referencedColumnName = "id")
    private Orders ordersByOrderId;
    @ManyToOne
    @JoinColumn(name = "product_detail_id", referencedColumnName = "id")
    private ProductDetail productDetailByProductDetailId;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }

    public Timestamp getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Timestamp updatedAt) {
        this.updatedAt = updatedAt;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        OrderDetail that = (OrderDetail) o;
        return id == that.id && Objects.equals(price, that.price) && Objects.equals(quantity, that.quantity) && Objects.equals(createdAt, that.createdAt) && Objects.equals(updatedAt, that.updatedAt);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, price, quantity, createdAt, updatedAt);
    }

    public Orders getOrdersByOrderId() {
        return ordersByOrderId;
    }

    public void setOrdersByOrderId(Orders ordersByOrderId) {
        this.ordersByOrderId = ordersByOrderId;
    }

    public ProductDetail getProductDetailByProductDetailId() {
        return productDetailByProductDetailId;
    }

    public void setProductDetailByProductDetailId(ProductDetail productDetailByProductDetailId) {
        this.productDetailByProductDetailId = productDetailByProductDetailId;
    }
}
