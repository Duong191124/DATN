package com.example.demo.service.impl;

import com.example.demo.dto.OrderDTO;
import com.example.demo.entity.*;
import com.example.demo.repository.*;
import com.example.demo.request.OrderDetailRequest;
import com.example.demo.response.OrderResponse;
import com.example.demo.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {
    private final OrderDetailRepo orderDetailRepo;
    private final OrderRepo orderRepo;
    private final  StaffRepo staffRepo;
    private final  VoucherRepo voucherRepo;
    private final ProductDetailRepo productDetailRepo;
    private final CustomerRepo customerRepo;

    @Override
    public List<OrderResponse> getAll() {
        List<OrderResponse> orderResponses = orderRepo.findAll().stream().map(OrderResponse::convertOrderResponse).collect(Collectors.toList());
        if(orderResponses.isEmpty()){
            throw new RuntimeException("order null");
        }
        return orderResponses ;
    }

    @Override
    public OrderResponse createdOrder(OrderDTO orderDTO) {
        Staff staff = staffRepo.findById(orderDTO.getStaffId()).orElseThrow(()->new RuntimeException("not found staff with id:"+orderDTO.getStaffId()));
        Customer customer = customerRepo.findById(orderDTO.getCustomerId()).orElseThrow(()->new RuntimeException("not found staff with id:"+orderDTO.getCustomerId()));
        Orders order = new Orders();
        order.setCode(orderDTO.getCode());
        order.setOrderDate(orderDTO.getOrderDate());
        order.setStaff(staff);
        order.setCustomer(customer);
        order.setMoneyReceived(orderDTO.getMoneyReceived());
        if (orderDTO.getVoucherId() != null) {
            Voucher voucher = voucherRepo.findById(orderDTO.getVoucherId())
                    .orElseThrow(() -> new RuntimeException("Voucher not found"));
            order.setVoucher(voucher);
        } else {
            order.setVoucher(null);
        }
        order.setStatus(OrderStatus.pending);
        if (orderDTO.getDeliveryFee() == null) {
            order.setDeliveryFee(0.0);
        } else {
            order.setDeliveryFee(orderDTO.getDeliveryFee());
        }
        List<OrderDetail> orderDetailUpdate = new ArrayList<>();
        List<ProductDetail> productDetailUpdate = new ArrayList<>();
        double totalAmount = 0.0;
        for (OrderDetailRequest orderDetailRequest: orderDTO.getOrderDetailRequests())  {
            ProductDetail productDetail = productDetailRepo.findById(orderDetailRequest.getProductDetailId()).orElseThrow(()->new RuntimeException("Not found product with id:"+orderDetailRequest.getProductDetailId()));
            if(productDetail.getQuantity()<=0|| productDetail.getQuantity() - orderDetailRequest.getQuantity() <0){
                throw new RuntimeException("Số lượng sản phẩm tồn kho không đủ hoặc sản phẩm hết hàng.");
            }
            productDetail.setQuantity(productDetail.getQuantity() - orderDetailRequest.getQuantity());
            productDetailUpdate.add(productDetail);
            OrderDetail orderDetail = new OrderDetail();
            orderDetail.setOrders(order);
            orderDetail.setQuantity(orderDetailRequest.getQuantity());
            orderDetail.setProductDetail(productDetail);
            orderDetail.setPrice(productDetail.getPrice());
            orderDetailUpdate.add(orderDetail);
            totalAmount += productDetail.getPrice() * orderDetailRequest.getQuantity();
        }
        order.setTotalAmount(totalAmount);
        orderRepo.save(order);
        orderDetailRepo.saveAll(orderDetailUpdate);
        productDetailRepo.saveAll(productDetailUpdate);
       return OrderResponse.convertOrderResponse(order);
    }

    @Override
    public OrderResponse updatedOrder(int id,OrderDTO orderDTO) {
        Optional<Orders> ordersOptional = orderRepo.findById(id);
        Staff staff = staffRepo.findById(orderDTO.getStaffId()).orElseThrow(()->new RuntimeException("not found staff with id:"+orderDTO.getStaffId()));
        Customer customer = customerRepo.findById(orderDTO.getCustomerId()).orElseThrow(()->new RuntimeException("not found customer with id:"+orderDTO.getCustomerId()));
        Voucher voucher = voucherRepo.findById(orderDTO.getVoucherId()).orElseThrow(()->new RuntimeException("not found voucher with id:"+orderDTO.getVoucherId()));
        if(ordersOptional.isEmpty()){
            throw new RuntimeException("not valid");
        }
        Orders orders = ordersOptional.get();
        orders.setStaff(staff);
        orders.setCustomer(customer);
        orders.setStatus(orderDTO.getStatus());
        orders.setDeliveryFee(orderDTO.getDeliveryFee());
        orders.setTotalAmount(orderDTO.getTotalAmount());
        if (orderDTO.getMoneyReceived()<orderDTO.getTotalAmount()){
            throw new RuntimeException("The money the customer gives must be greater than the total amount");
        }
        orders.setVoucher(voucher);
        if (orderDTO.getOrderDetailRequests() != null && !orderDTO.getOrderDetailRequests().isEmpty()) {
            List<OrderDetailRequest> orderDetailRequests = orderDTO.getOrderDetailRequests();

            // Lặp qua từng chi tiết đơn hàng trong yêu cầu
            for (OrderDetailRequest detailRequest : orderDetailRequests) {
                ProductDetail productDetail = productDetailRepo.findById(detailRequest.getProductDetailId())
                        .orElseThrow(() -> new RuntimeException("Product not found with id: " + detailRequest.getProductDetailId()));

                // Kiểm tra nếu sản phẩm đã tồn tại trong chi tiết đơn hàng
                Optional<OrderDetail> existingDetail = orders.getOrderDetails().stream()
                        .filter(orderDetail -> orderDetail.getProductDetail().getId().equals(productDetail.getId()))
                        .findFirst();

                if (existingDetail.isPresent()) {
                    // Cập nhật chi tiết đơn hàng nếu sản phẩm đã tồn tại
                    OrderDetail orderDetail = existingDetail.get();
                    orderDetail.setQuantity(detailRequest.getQuantity());
                    orderDetailRepo.save(orderDetail);  // Cập nhật lại chi tiết đơn hàng
                } else {
                    // Nếu sản phẩm chưa tồn tại trong đơn hàng, thêm mới chi tiết đơn hàng
                    OrderDetail newOrderDetail = new OrderDetail();
                    newOrderDetail.setOrders(orders);  // Đảm bảo rằng chi tiết đơn hàng liên kết với đơn hàng hiện tại
                    newOrderDetail.setProductDetail(productDetail);
                    newOrderDetail.setQuantity(detailRequest.getQuantity());

                    orderDetailRepo.save(newOrderDetail);  // Thêm chi tiết đơn hàng mới
                }
            }
            // Xóa các sản phẩm không còn tồn tại trong orderDetailRequests
            List<Integer> requestProductIds = orderDetailRequests.stream()
                    .map(OrderDetailRequest::getProductDetailId)
                    .collect(Collectors.toList());
            List<OrderDetail> orderDetailsToRemove = orders.getOrderDetails().stream()
                    .filter(orderDetail -> !requestProductIds.contains(orderDetail.getProductDetail().getId()))
                    .collect(Collectors.toList());

            // Xóa các chi tiết đơn hàng không còn trong yêu cầu
            if (!orderDetailsToRemove.isEmpty()) {
                orderDetailRepo.deleteAll(orderDetailsToRemove);
            }
        }
        return OrderResponse.convertOrderResponse(orderRepo.save(orders));
    }

    @Override
    public OrderResponse updateStatusOrder(Integer id, String status) {
        Orders orders = orderRepo.findById(id).orElseThrow(()-> new RuntimeException("not found order with id:"+id));
        OrderStatus orderStatus = OrderStatus.valueOf(status.toLowerCase());
        orders.setStatus(orderStatus);
        orderRepo.save(orders);
        return OrderResponse.convertOrderResponse(orders);
    }

    @Override
    public void deletedOrder(Integer id) {
        Orders orders = orderRepo.findById(id).orElseThrow(()->new RuntimeException("not found order with id:"+ id));
        orderRepo.delete(orders);
    }

    @Override
    public OrderResponse findById(Integer id) {
        return orderRepo.findById(id).map(OrderResponse::convertOrderResponse).orElseThrow(()->new RuntimeException("not found order with id:"+ id));
    }

    @Override
    public Page<OrderResponse> pageAll(String staffName, LocalDate  startDate, LocalDate endDate, OrderStatus orderStatus, String orderCode, Pageable pageable) {
        Page<Orders> ordersPage = orderRepo.pageAll(staffName,startDate,endDate,orderStatus,orderCode,pageable);
        return ordersPage.map(OrderResponse::convertOrderResponse);
    }
}
