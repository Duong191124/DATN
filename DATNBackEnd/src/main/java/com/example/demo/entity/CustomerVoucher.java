package com.example.demo.entity;

import jakarta.persistence.*;

import java.util.Objects;

@Entity
@Table(name = "customer_voucher", schema = "datn", catalog = "")
public class CustomerVoucher {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "voucher_id")
    private int voucherId;
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "customer_id")
    private int customerId;
    @ManyToOne
    @JoinColumn(name = "voucher_id", referencedColumnName = "id", nullable = false)
    private Voucher voucherByVoucherId;
    @ManyToOne
    @JoinColumn(name = "customer_id", referencedColumnName = "id", nullable = false)
    private Customer customerByCustomerId;

    public int getVoucherId() {
        return voucherId;
    }

    public void setVoucherId(int voucherId) {
        this.voucherId = voucherId;
    }

    public int getCustomerId() {
        return customerId;
    }

    public void setCustomerId(int customerId) {
        this.customerId = customerId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CustomerVoucher that = (CustomerVoucher) o;
        return voucherId == that.voucherId && customerId == that.customerId;
    }

    @Override
    public int hashCode() {
        return Objects.hash(voucherId, customerId);
    }

    public Voucher getVoucherByVoucherId() {
        return voucherByVoucherId;
    }

    public void setVoucherByVoucherId(Voucher voucherByVoucherId) {
        this.voucherByVoucherId = voucherByVoucherId;
    }

    public Customer getCustomerByCustomerId() {
        return customerByCustomerId;
    }

    public void setCustomerByCustomerId(Customer customerByCustomerId) {
        this.customerByCustomerId = customerByCustomerId;
    }
}
