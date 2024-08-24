package com.example.demo.service;

import com.example.demo.dto.PromotionDTO;
import com.example.demo.entity.Promotion;
import com.example.demo.repository.PromotionRepo;
import com.example.demo.service.impl.PromotionServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class PromotionService implements PromotionServiceImpl {

    private final PromotionRepo promotionRepo;

    @Override
    public List<Promotion> getAll() {
        return promotionRepo.findAll();
    }

    @Override
    public Promotion add(PromotionDTO promotion) {
        Promotion newPromotion = Promotion
                .builder()
                .name(promotion.getName())
                .description(promotion.getDescription())
                .discountAmount(promotion.getDiscountAmount())
                .discountPercent(promotion.getDiscountPercent())
                .startDate(promotion.getStartDate())
                .endDate(promotion.getEndDate())
                .status(promotion.getStatus())
                .productDetails(promotion.getProductDetails())
                .build();
        return promotionRepo.save(newPromotion);
    }

    @Override
    public Promotion update(Integer id, PromotionDTO promotion) throws Exception {
        Promotion existingPromotion = getPromotionById(id);
        existingPromotion.setName(promotion.getName());
        existingPromotion.setDescription(promotion.getDescription());
        existingPromotion.setDiscountAmount(promotion.getDiscountAmount());
        existingPromotion.setDiscountPercent(promotion.getDiscountPercent());
        existingPromotion.setStartDate(promotion.getStartDate());
        existingPromotion.setEndDate(promotion.getEndDate());
        existingPromotion.setStatus(promotion.getStatus());
        existingPromotion.setProductDetails(promotion.getProductDetails());
        return promotionRepo.save(existingPromotion);
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
