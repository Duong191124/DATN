package com.example.demo.service;

import com.example.demo.dto.PromotionDTO;
import com.example.demo.entity.Promotion;
import com.example.demo.response.PromotionResponse;
import com.example.demo.response.VoucherResponse;

import java.util.List;

public interface PromotionService {
    List<Promotion> getAll();

    PromotionResponse add(PromotionDTO promotion);

    PromotionResponse update(Integer id, PromotionDTO promotion) throws Exception;

    Promotion getPromotionById(Integer id) throws Exception;

    void deletePromotion(Integer id) throws Exception;

    PromotionResponse updateProductDetails(Integer promotionId, List<Integer> productDetailsIds, Boolean applyPromotion) throws Exception;

    PromotionResponse changeStatus(Integer id) throws Exception;


}
