package com.example.demo.service;

import com.example.demo.dto.CartDetailDTO;
import com.example.demo.entity.CartDetail;
import com.example.demo.repository.CartDetailRepo;
import com.example.demo.service.impl.CartDetailServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class CartDetailService implements CartDetailServiceImpl {
    private final CartDetailRepo cartDetailRepo;

    @Override
    public List<CartDetail> getAll() {
        return cartDetailRepo.findAll();
    }

    @Override
    public CartDetail add(CartDetailDTO cartDetailDTO) {
        CartDetail newCartDetail = CartDetail.builder()
                .quantity(cartDetailDTO.getQuantity())
                .price(cartDetailDTO.getPrice())
                .totalPrice(cartDetailDTO.getTotalPrice())
                .account(cartDetailDTO.getAccount())
                .product(cartDetailDTO.getProduct())
                .orders(cartDetailDTO.getOrders())
                .build();
        return cartDetailRepo.save(newCartDetail);
    }

    @Override
    public CartDetail update(Integer id, CartDetailDTO cartDetailDTO) throws Exception {
        CartDetail cartDetail = getCartById(id);
        cartDetail.setQuantity(cartDetailDTO.getQuantity());
        cartDetail.setPrice(cartDetailDTO.getPrice());
        cartDetail.setTotalPrice(cartDetailDTO.getTotalPrice());
        cartDetail.setAccount(cartDetailDTO.getAccount());
        cartDetail.setProduct(cartDetailDTO.getProduct());
        cartDetail.setOrders(cartDetail.getOrders());
        return cartDetailRepo.save(cartDetail);

    }

    @Override
    public CartDetail getCartById(Integer id) throws Exception {
        return null;
    }

    @Override
    public void delete(Integer id) throws Exception {
        CartDetail cartDetail = getCartById(id);
        cartDetailRepo.delete(cartDetail);

    }
}
