package com.example.demo.entity;

import jakarta.persistence.*;

import java.util.Objects;

@Entity
@Table(name = "product_promotion", schema = "datn", catalog = "")
public class ProductPromotion {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "promotion_id")
    private int promotionId;
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "product_detail_id")
    private int productDetailId;
    @ManyToOne
    @JoinColumn(name = "promotion_id", referencedColumnName = "id", nullable = false)
    private Promotion promotionByPromotionId;
    @ManyToOne
    @JoinColumn(name = "product_detail_id", referencedColumnName = "id", nullable = false)
    private ProductDetail productDetailByProductDetailId;

    public int getPromotionId() {
        return promotionId;
    }

    public void setPromotionId(int promotionId) {
        this.promotionId = promotionId;
    }

    public int getProductDetailId() {
        return productDetailId;
    }

    public void setProductDetailId(int productDetailId) {
        this.productDetailId = productDetailId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ProductPromotion that = (ProductPromotion) o;
        return promotionId == that.promotionId && productDetailId == that.productDetailId;
    }

    @Override
    public int hashCode() {
        return Objects.hash(promotionId, productDetailId);
    }

    public Promotion getPromotionByPromotionId() {
        return promotionByPromotionId;
    }

    public void setPromotionByPromotionId(Promotion promotionByPromotionId) {
        this.promotionByPromotionId = promotionByPromotionId;
    }

    public ProductDetail getProductDetailByProductDetailId() {
        return productDetailByProductDetailId;
    }

    public void setProductDetailByProductDetailId(ProductDetail productDetailByProductDetailId) {
        this.productDetailByProductDetailId = productDetailByProductDetailId;
    }
}
