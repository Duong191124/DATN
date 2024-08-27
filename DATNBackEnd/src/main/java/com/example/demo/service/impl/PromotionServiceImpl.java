package com.example.demo.service.impl;

import com.example.demo.dto.PromotionDTO;
import com.example.demo.entity.Promotion;

import java.util.List;

public interface PromotionServiceImpl {
    List<Promotion> getAll();

    Promotion add(PromotionDTO promotion);

    Promotion update(Integer id, PromotionDTO promotion) throws Exception;

    Promotion getPromotionById(Integer id) throws Exception;

    void deletePromotion(Integer id) throws Exception;

}
