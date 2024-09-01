package com.example.demo.service;

import com.example.demo.dto.CartDetailDTO;
import com.example.demo.entity.CartDetail;
import com.example.demo.response.CartDetailResponse;

import java.util.List;

public interface CartDetailService {

    List<CartDetail> getAll();

    CartDetailResponse add(CartDetailDTO cartDetailDTO) throws Exception;

    CartDetailResponse update(Integer id, CartDetailDTO cartDetailDTO) throws Exception;

    CartDetail getCartById(Integer id) throws Exception;

    void delete(Integer id) throws Exception;
}
