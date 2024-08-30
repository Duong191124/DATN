package com.example.demo.entity;

import jakarta.persistence.*;

import java.util.Objects;

@Entity
@Table(name = "cart_detail", schema = "datn", catalog = "")
public class CartDetail {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private int id;
    @Basic
    @Column(name = "quantity")
    private Integer quantity;
    @Basic
    @Column(name = "price")
    private Double price;
    @Basic
    @Column(name = "total_price")
    private Double totalPrice;
    @ManyToOne
    @JoinColumn(name = "customer_id", referencedColumnName = "id")
    private Customer customerByCustomerId;
    @ManyToOne
    @JoinColumn(name = "product_detail_id", referencedColumnName = "id")
    private ProductDetail productDetailByProductDetailId;
    @ManyToOne
    @JoinColumn(name = "order_id", referencedColumnName = "id")
    private Orders ordersByOrderId;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(Double totalPrice) {
        this.totalPrice = totalPrice;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CartDetail that = (CartDetail) o;
        return id == that.id && Objects.equals(quantity, that.quantity) && Objects.equals(price, that.price) && Objects.equals(totalPrice, that.totalPrice);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, quantity, price, totalPrice);
    }

    public Customer getCustomerByCustomerId() {
        return customerByCustomerId;
    }

    public void setCustomerByCustomerId(Customer customerByCustomerId) {
        this.customerByCustomerId = customerByCustomerId;
    }

    public ProductDetail getProductDetailByProductDetailId() {
        return productDetailByProductDetailId;
    }

    public void setProductDetailByProductDetailId(ProductDetail productDetailByProductDetailId) {
        this.productDetailByProductDetailId = productDetailByProductDetailId;
    }

    public Orders getOrdersByOrderId() {
        return ordersByOrderId;
    }

    public void setOrdersByOrderId(Orders ordersByOrderId) {
        this.ordersByOrderId = ordersByOrderId;
    }
}
