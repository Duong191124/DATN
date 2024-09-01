package com.example.demo.service.impl;

import com.example.demo.dto.CartDetailDTO;
import com.example.demo.entity.*;
import com.example.demo.repository.CartDetailRepo;
import com.example.demo.repository.CustomerRepo;
import com.example.demo.repository.OrderRepo;
import com.example.demo.repository.ProductDetailRepo;
import com.example.demo.response.CartDetailResponse;
import com.example.demo.service.CartDetailService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class CartDetailServiceImpl implements CartDetailService {
    private final CartDetailRepo cartDetailRepo;
    private final CustomerRepo customerRepo;
    private final ProductDetailRepo productDetailRepo;
    private final OrderRepo orderRepo;

    @Override
    public List<CartDetail> getAll() {
        return cartDetailRepo.findAll();
    }

    @Override
    public CartDetailResponse add(CartDetailDTO cartDetailDTO) throws Exception {
        Orders existingOrders = orderRepo.findById(cartDetailDTO.getOrdersId())
                .orElseThrow(() -> new Exception(""));
        Customer existingCustomer = customerRepo.findById(cartDetailDTO.getCustomerId())
                .orElseThrow(() -> new Exception(""));
        ProductDetail existingProductDetail = productDetailRepo.findById(cartDetailDTO.getProductDetailId())
                .orElse(null);

        CartDetail newCartDetail = CartDetail.builder()
                .quantity(cartDetailDTO.getQuantity())
                .price(cartDetailDTO.getPrice())
                .totalPrice(cartDetailDTO.getTotalPrice())
                .customer(existingCustomer)
                .productDetail(existingProductDetail)
                .orders(existingOrders)
                .build();
        CartDetail addCartDetail = cartDetailRepo.save(newCartDetail);
        return CartDetailResponse.fromCartDetailResponse(addCartDetail);
    }

    @Override
    public CartDetailResponse update(Integer id, CartDetailDTO cartDetailDTO) throws Exception {
        Orders existingOrders = orderRepo.findById(cartDetailDTO.getOrdersId())
                .orElseThrow(() -> new Exception(""));
        Customer existingCustomer = customerRepo.findById(cartDetailDTO.getCustomerId())
                .orElseThrow(() -> new Exception(""));
        ProductDetail existingProductDetail = productDetailRepo.findById(cartDetailDTO.getProductDetailId())
                .orElse(null);
        CartDetail cartDetail = getCartById(id);
        cartDetail.setQuantity(cartDetailDTO.getQuantity());
        cartDetail.setPrice(cartDetailDTO.getPrice());
        cartDetail.setTotalPrice(cartDetailDTO.getTotalPrice());
        cartDetail.setCustomer(existingCustomer);
        cartDetail.setProductDetail(existingProductDetail);
        cartDetail.setOrders(existingOrders);
        CartDetail updateCartDetail = cartDetailRepo.save(cartDetail);
        return CartDetailResponse.fromCartDetailResponse(updateCartDetail);

    }

    @Override
    public CartDetail getCartById(Integer id) throws Exception {
        return cartDetailRepo.findById(id).get();
    }

    @Override
    public void delete(Integer id) throws Exception {
        CartDetail cartDetail = getCartById(id);
        cartDetailRepo.delete(cartDetail);
    }
}
