package com.example.demo.service.impl;

import com.example.demo.dto.CartDetailDTO;
import com.example.demo.entity.CartDetail;

import java.util.List;

public interface CartDetailServiceImpl {

    List<CartDetail> getAll();

    CartDetail add(CartDetailDTO cartDetailDTO);

    CartDetail update(Integer id, CartDetailDTO cartDetailDTO) throws Exception;

    CartDetail getCartById(Integer id) throws Exception;

    void delete(Integer id) throws Exception;
}
