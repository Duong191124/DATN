package com.example.demo.service.impl;

import com.example.demo.dto.PromotionDTO;
import com.example.demo.entity.ProductDetail;
import com.example.demo.entity.Promotion;
import com.example.demo.repository.ProductDetailRepo;
import com.example.demo.repository.PromotionRepo;
import com.example.demo.response.PromotionResponse;
import com.example.demo.service.PromotionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RequiredArgsConstructor
@Service
public class PromotionServiceImpl implements PromotionService {

    private final PromotionRepo promotionRepo;
    private final ProductDetailRepo productDetailRepo;

    @Override
    public List<Promotion> getAll() {
        return promotionRepo.findAll();
    }

    @Override
    public PromotionResponse add(PromotionDTO promotion) {
        ProductDetail productDetail = productDetailRepo.findById(promotion.getProductDetailsId())
                .orElse(null);
        Promotion newPromotion = Promotion
                .builder()
                .name(promotion.getName())
                .description(promotion.getDescription())
                .discountAmount(promotion.getDiscountAmount())
                .discountPercent(promotion.getDiscountPercent())
                .startDate(promotion.getStartDate())
                .endDate(promotion.getEndDate())
                .status(promotion.getStatus())
                .productDetails(productDetail != null ? Set.of(productDetail) : Set.of())
                .build();
        Promotion addPromotion = promotionRepo.save(newPromotion);
        return PromotionResponse.fromPromotionResponse(addPromotion);
    }

    @Override
    public PromotionResponse update(Integer id, PromotionDTO promotion) throws Exception {
        ProductDetail productDetail = productDetailRepo.findById(promotion.getProductDetailsId())
                .orElseThrow(() -> new Exception(""));
        Promotion existingPromotion = getPromotionById(id);
        existingPromotion.setName(promotion.getName());
        existingPromotion.setDescription(promotion.getDescription());
        existingPromotion.setDiscountAmount(promotion.getDiscountAmount());
        existingPromotion.setDiscountPercent(promotion.getDiscountPercent());
        existingPromotion.setStartDate(promotion.getStartDate());
        existingPromotion.setEndDate(promotion.getEndDate());
        existingPromotion.setStatus(promotion.getStatus());
        Set<ProductDetail> productDetails = new HashSet<>();
        productDetails.add(productDetail);
        existingPromotion.setProductDetails(productDetails);
        Promotion updatePromotion = promotionRepo.save(existingPromotion);
        return PromotionResponse.fromPromotionResponse(updatePromotion);
    }

    @Override
    public Promotion getPromotionById(Integer id) throws Exception {
        return promotionRepo.findById(id).orElseThrow(() -> new Exception(""));
    }

    @Override
    public void deletePromotion(Integer id) throws Exception {
        Promotion existingPromotion = getPromotionById(id);
        promotionRepo.delete(existingPromotion);
    }
}
