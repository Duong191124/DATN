package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;


@Entity
@Table(name = "orders")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Orders extends BaseEntity {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id", nullable = false)
    private Integer id;
    @Basic
    @Column(name = "code")
    private String code;
    @Basic
    @Column(name = "status", nullable = true, length = 255)
    @Enumerated(EnumType.STRING)
    private OrderStatus status;
    @Basic
    @Column(name = "order_date", nullable = true)
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate orderDate;
    @Basic
    @Column(name = "delivery_fee", nullable = true, precision = 0)
    private Double deliveryFee;
    @Basic
    @Column(name = "total_amount", nullable = true, precision = 0)
    private Double totalAmount;
    @Basic
    @Column(name = "money_received", nullable = true, precision = 0)
    private Double moneyReceived;
    @Column(name = "address", columnDefinition = "JSON")
    private String address;
    @Column(name = "tracking_number")
    private String trackingNumber;
    @Column(name = "note")
    private String note;
    @Column(name = "order_type", nullable = true, length = 255)
    @Enumerated(EnumType.STRING)
    private OrderType orderType;
    @ManyToOne
    @JoinColumn(name = "voucher_id", referencedColumnName = "id",nullable = true)
    private Voucher voucher;
    @ManyToOne
    @JoinColumn(name = "staff_id", referencedColumnName = "id")
    private Staff staff;
    @ManyToOne
    @JoinColumn(name = "customer_id", referencedColumnName = "id")
    private Customer customer;
    @OneToMany(mappedBy = "orders",cascade = CascadeType.ALL,orphanRemoval = true)
    private List<OrderDetail> orderDetails = new ArrayList<>();
    @OneToMany(mappedBy = "orders",cascade = CascadeType.ALL,orphanRemoval = true)
    private List<Payment> payments = new ArrayList<>();
    public void addOrderDetail(OrderDetail orderDetail) {
        orderDetails.add(orderDetail);
        orderDetail.setOrders(this);
    }

    // Xóa OrderDetail
    public void removeOrderDetail(OrderDetail orderDetail) {
        orderDetails.remove(orderDetail);
        orderDetail.setOrders(null);
    }

    // Thêm Payment
    public void addPayment(Payment payment) {
        payments.add(payment);
        payment.setOrders(this);
    }

    // Xóa Payment
    public void removePayment(Payment payment) {
        payments.remove(payment);
        payment.setOrders(null);
    }
}
