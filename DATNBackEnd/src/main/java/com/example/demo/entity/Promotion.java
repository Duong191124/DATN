package com.example.demo.entity;

import jakarta.persistence.*;

import java.sql.Timestamp;
import java.util.Collection;
import java.util.Objects;

@Entity
public class Promotion {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private int id;
    @Basic
    @Column(name = "name")
    private String name;
    @Basic
    @Column(name = "description")
    private String description;
    @Basic
    @Column(name = "start_date")
    private Timestamp startDate;
    @Basic
    @Column(name = "end_date")
    private Timestamp endDate;
    @Basic
    @Column(name = "discount_percent")
    private String discountPercent;
    @Basic
    @Column(name = "discount_amount")
    private String discountAmount;
    @Basic
    @Column(name = "status")
    private Integer status;
    @Basic
    @Column(name = "created_at")
    private Timestamp createdAt;
    @Basic
    @Column(name = "updated_at")
    private Timestamp updatedAt;
    @OneToMany(mappedBy = "promotionByPromotionId")
    private Collection<ProductPromotion> productPromotionsById;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Timestamp getStartDate() {
        return startDate;
    }

    public void setStartDate(Timestamp startDate) {
        this.startDate = startDate;
    }

    public Timestamp getEndDate() {
        return endDate;
    }

    public void setEndDate(Timestamp endDate) {
        this.endDate = endDate;
    }

    public String getDiscountPercent() {
        return discountPercent;
    }

    public void setDiscountPercent(String discountPercent) {
        this.discountPercent = discountPercent;
    }

    public String getDiscountAmount() {
        return discountAmount;
    }

    public void setDiscountAmount(String discountAmount) {
        this.discountAmount = discountAmount;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
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
        Promotion promotion = (Promotion) o;
        return id == promotion.id && Objects.equals(name, promotion.name) && Objects.equals(description, promotion.description) && Objects.equals(startDate, promotion.startDate) && Objects.equals(endDate, promotion.endDate) && Objects.equals(discountPercent, promotion.discountPercent) && Objects.equals(discountAmount, promotion.discountAmount) && Objects.equals(status, promotion.status) && Objects.equals(createdAt, promotion.createdAt) && Objects.equals(updatedAt, promotion.updatedAt);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, description, startDate, endDate, discountPercent, discountAmount, status, createdAt, updatedAt);
    }

    public Collection<ProductPromotion> getProductPromotionsById() {
        return productPromotionsById;
    }

    public void setProductPromotionsById(Collection<ProductPromotion> productPromotionsById) {
        this.productPromotionsById = productPromotionsById;
    }
}
