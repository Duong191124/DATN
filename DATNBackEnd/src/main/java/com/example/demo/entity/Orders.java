package com.example.demo.entity;

import jakarta.persistence.*;

import java.sql.Date;
import java.sql.Timestamp;
import java.util.Collection;
import java.util.Objects;

@Entity
public class Orders {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private int id;
    @Basic
    @Column(name = "status")
    private Object status;
    @Basic
    @Column(name = "order_date")
    private Date orderDate;
    @Basic
    @Column(name = "delivery_fee")
    private Double deliveryFee;
    @Basic
    @Column(name = "total_amount")
    private Double totalAmount;
    @Basic
    @Column(name = "created_at")
    private Timestamp createdAt;
    @Basic
    @Column(name = "updated_at")
    private Timestamp updatedAt;
    @OneToMany(mappedBy = "ordersByOrderId")
    private Collection<CartDetail> cartDetailsById;
    @OneToMany(mappedBy = "ordersByOrderId")
    private Collection<OrderDetail> orderDetailsById;
    @ManyToOne
    @JoinColumn(name = "voucher_id", referencedColumnName = "id")
    private Voucher voucherByVoucherId;
    @ManyToOne
    @JoinColumn(name = "staff_id", referencedColumnName = "id")
    private Staff staffByStaffId;
    @ManyToOne
    @JoinColumn(name = "customer_id", referencedColumnName = "id")
    private Customer customerByCustomerId;
    @OneToMany(mappedBy = "ordersByOrderId")
    private Collection<Payment> paymentsById;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Object getStatus() {
        return status;
    }

    public void setStatus(Object status) {
        this.status = status;
    }

    public Date getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(Date orderDate) {
        this.orderDate = orderDate;
    }

    public Double getDeliveryFee() {
        return deliveryFee;
    }

    public void setDeliveryFee(Double deliveryFee) {
        this.deliveryFee = deliveryFee;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
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
        Orders orders = (Orders) o;
        return id == orders.id && Objects.equals(status, orders.status) && Objects.equals(orderDate, orders.orderDate) && Objects.equals(deliveryFee, orders.deliveryFee) && Objects.equals(totalAmount, orders.totalAmount) && Objects.equals(createdAt, orders.createdAt) && Objects.equals(updatedAt, orders.updatedAt);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, status, orderDate, deliveryFee, totalAmount, createdAt, updatedAt);
    }

    public Collection<CartDetail> getCartDetailsById() {
        return cartDetailsById;
    }

    public void setCartDetailsById(Collection<CartDetail> cartDetailsById) {
        this.cartDetailsById = cartDetailsById;
    }

    public Collection<OrderDetail> getOrderDetailsById() {
        return orderDetailsById;
    }

    public void setOrderDetailsById(Collection<OrderDetail> orderDetailsById) {
        this.orderDetailsById = orderDetailsById;
    }

    public Voucher getVoucherByVoucherId() {
        return voucherByVoucherId;
    }

    public void setVoucherByVoucherId(Voucher voucherByVoucherId) {
        this.voucherByVoucherId = voucherByVoucherId;
    }

    public Staff getStaffByStaffId() {
        return staffByStaffId;
    }

    public void setStaffByStaffId(Staff staffByStaffId) {
        this.staffByStaffId = staffByStaffId;
    }

    public Customer getCustomerByCustomerId() {
        return customerByCustomerId;
    }

    public void setCustomerByCustomerId(Customer customerByCustomerId) {
        this.customerByCustomerId = customerByCustomerId;
    }

    public Collection<Payment> getPaymentsById() {
        return paymentsById;
    }

    public void setPaymentsById(Collection<Payment> paymentsById) {
        this.paymentsById = paymentsById;
    }
}
