package com.example.demo.service.impl;

import com.example.demo.dto.OrderDTO;
import com.example.demo.entity.*;
import com.example.demo.repository.*;
import com.example.demo.request.OrderDetailRequest;
import com.example.demo.request.OrderWithVoucherAndOrderDetailRequest;
import com.example.demo.response.OrderResponse;
import com.example.demo.service.OrderService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
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
        Integer customerId = orderDTO.getCustomerId();
        if (customerId == null || customerId <= 0) {
            customerId = 1;
        }
        Staff staff = staffRepo.findById(orderDTO.getStaffId()).orElseThrow(()->new RuntimeException("not found staff with id:"+orderDTO.getStaffId()));
        Customer customer = customerRepo.findById(customerId).get();
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
        order.setTotalAmount(totalAmount);
        orderRepo.save(order);
        orderDetailRepo.saveAll(orderDetailUpdate);
        productDetailRepo.saveAll(productDetailUpdate);
       return OrderResponse.convertOrderResponse(order);
    }

    @Override
    @Transactional
    public OrderResponse updatedOrder(int id, OrderDTO orderDTO) {
        // Tìm đơn hàng theo id
        Optional<Orders> ordersOptional = orderRepo.findById(id);
        Staff staff = staffRepo.findById(orderDTO.getStaffId())
                .orElseThrow(() -> new RuntimeException("Not found staff with id: " + orderDTO.getStaffId()));
        Customer customer = customerRepo.findById(orderDTO.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Not found customer with id: " + orderDTO.getCustomerId()));

        // Kiểm tra voucher nếu có
        Voucher voucher = null;
        if (orderDTO.getVoucherId() != null) {
            voucher = voucherRepo.findById(orderDTO.getVoucherId())
                    .orElseThrow(() -> new RuntimeException("Not found voucher with id: " + orderDTO.getVoucherId()));

            // Kiểm tra tính hợp lệ của voucher (đã hết hạn, số lượng còn lại)
            if (voucher.getExpirationDate().isBefore(LocalDateTime.now())) {
                throw new RuntimeException("Voucher has expired");
            }

            if (voucher.getQuantity() <= 0) {
                throw new RuntimeException("Voucher is no longer available");
            }

            // Kiểm tra xem voucher có điều kiện áp dụng hay không
            BigDecimal minPurchaseAmount = new BigDecimal(voucher.getMinPurchaseAmount());
            if (minPurchaseAmount.compareTo(BigDecimal.valueOf(orderDTO.getTotalAmount())) > 0) {
                throw new RuntimeException("Order total amount does not meet the minimum purchase amount for this voucher");
            }
        }

        if (ordersOptional.isEmpty()) {
            throw new RuntimeException("Not valid");
        }

        Orders orders = ordersOptional.get();
        orders.setStaff(staff);
        orders.setCustomer(customer);
        orders.setStatus(orderDTO.getStatus());
        orders.setDeliveryFee(orderDTO.getDeliveryFee());
        orders.setTotalAmount(orderDTO.getTotalAmount());

        // Kiểm tra tiền nhận từ khách hàng
        if (orderDTO.getMoneyReceived() < orderDTO.getTotalAmount()) {
            throw new RuntimeException("The money the customer gives must be greater than the total amount");
        }

        // Gán voucher cho đơn hàng (nếu có)
        if (voucher != null) {
            orders.setVoucher(voucher);
            // Tính toán lại tổng tiền với voucher
            BigDecimal discountAmount = BigDecimal.ZERO;

            if (voucher.getDiscountAmount() != null) {
                discountAmount = new BigDecimal(voucher.getDiscountAmount());
            } else if (voucher.getDiscountPercent() != null) {
                discountAmount = BigDecimal.valueOf(orderDTO.getTotalAmount())
                        .multiply(new BigDecimal(voucher.getDiscountPercent()))
                        .divide(BigDecimal.valueOf(100));
                // Nếu có giới hạn giảm giá tối đa
                if (voucher.getMaxDiscountAmount() != null) {
                    BigDecimal maxDiscount = new BigDecimal(voucher.getMaxDiscountAmount());
                    discountAmount = discountAmount.min(maxDiscount);
                }
            }

            // Cập nhật tổng tiền sau khi áp dụng voucher
            BigDecimal totalAmountWithDiscount = BigDecimal.valueOf(orderDTO.getTotalAmount()).subtract(discountAmount);
            orders.setTotalAmount(totalAmountWithDiscount.doubleValue());

            // Giảm số lượng voucher còn lại sau khi sử dụng
            voucher.setQuantity(voucher.getQuantity() - 1);
            voucherRepo.save(voucher);  // Lưu thay đổi vào voucher
        }

        // Cập nhật các chi tiết đơn hàng
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

        // Lưu lại đơn hàng sau khi cập nhật
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
    public OrderResponse findByCode(String code) {
        return OrderResponse.convertOrderResponse(orderRepo.findByCode(code));
    }
    @Override
    public boolean hasCustomerExitVoucher(int customerId, int voucherId) {
        List<Orders> orders = orderRepo.findByCustomerId(customerId);
        return orders.stream()
                .anyMatch(order -> order.getVoucher() != null && order.getVoucher().getId() == voucherId);
    }
    @Override
    public boolean hasCustomerUsedVoucher(int customerId, int voucherId) {
        Long count = orderRepo.countByCustomerIdAndVoucherId(customerId, voucherId);
        return count > 0; // Nếu count > 0, có nghĩa là voucher đã được sử dụng
    }

    @Override
    @Transactional
    public OrderResponse updatedOrderWithProductDetail(Integer id, OrderWithVoucherAndOrderDetailRequest orderUpdateRequest) {
        // Tìm đơn hàng theo ID
        Orders order = orderRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        Customer customer = customerRepo.findById(order.getCustomer().getId())
                .orElseThrow(() -> new RuntimeException("Not found customer with id: " + order.getCustomer().getId()));

        // Xử lý chi tiết sản phẩm (orderDetailRequests)
        List<OrderDetail> orderDetailsToSave = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO;  // Sử dụng BigDecimal cho tổng số tiền

        // Xử lý từng chi tiết sản phẩm trong yêu cầu
        for (OrderDetailRequest detailRequest : orderUpdateRequest.getOrderDetailRequests()) {
            ProductDetail productDetail = productDetailRepo.findById(detailRequest.getProductDetailId())
                    .orElseThrow(() -> new RuntimeException("Product detail not found"));

            // Kiểm tra tính khả dụng của sản phẩm (số lượng)
            if (detailRequest.getQuantity() > productDetail.getQuantity()) {
                throw new RuntimeException("Insufficient quantity for product detail ID " + detailRequest.getProductDetailId());
            }

            // Cập nhật số lượng sản phẩm
            productDetail.setQuantity(productDetail.getQuantity() - detailRequest.getQuantity());
            if (productDetail.getQuantity() == 0) {
                productDetail.setStatus(0);
            }
            productDetailRepo.save(productDetail);

            // Thêm chi tiết đơn hàng vào danh sách
            OrderDetail orderDetail = new OrderDetail();
            orderDetail.setOrders(order);
            orderDetail.setProductDetail(productDetail);

            BigDecimal discountPriceBigDecimal = BigDecimal.valueOf(productDetail.getDiscountPrice());

            BigDecimal priceToUse = (discountPriceBigDecimal != null && discountPriceBigDecimal.compareTo(BigDecimal.ZERO) > 0)
                    ? discountPriceBigDecimal // Giữ nguyên BigDecimal nếu có giá giảm
                    : BigDecimal.valueOf(productDetail.getDefaultPrice()); // Nếu không có giá giảm, sử dụng giá mặc định
            // Nếu không có giá giảm, sử dụng giá mặc định và giữ nguyên BigDecimal
            orderDetail.setPrice(priceToUse.doubleValue());  // Chuyển đổi BigDecimal thành Double khi lưu vào OrderDetail
            orderDetail.setQuantity(detailRequest.getQuantity());

            // Tính toán tổng số tiền cho sản phẩm
            totalAmount = totalAmount.add(priceToUse.multiply(BigDecimal.valueOf(detailRequest.getQuantity())));


            order.getOrderDetails().add(orderDetail);
            orderDetailsToSave.add(orderDetail);
        }

        // Xử lý voucher nếu có voucherId
        if (orderUpdateRequest.getVoucherId() != null) {
            Voucher voucher = voucherRepo.findById(orderUpdateRequest.getVoucherId())
                    .orElseThrow(() -> new RuntimeException("Voucher not found"));

            // Kiểm tra xem khách hàng đã sử dụng voucher này chưa
            if (hasCustomerExitVoucher(customer.getId(), orderUpdateRequest.getVoucherId())) {
                throw new RuntimeException("Khách hàng đã sử dụng voucher này.");
            }

            // Kiểm tra tính hợp lệ của voucher (hạn sử dụng, số lượng, v.v.)
            if (voucher.getExpirationDate().isBefore(LocalDateTime.now())) {
                throw new RuntimeException("Voucher has expired");
            }

            if (voucher.getQuantity() <= 0) {
                throw new RuntimeException("Voucher is no longer available");
            }

            // Kiểm tra số tiền tối thiểu để áp dụng voucher
            BigDecimal minPurchaseAmount = new BigDecimal(voucher.getMinPurchaseAmount());
            if (totalAmount.compareTo(minPurchaseAmount) < 0) {
                throw new RuntimeException("Total amount is less than the minimum purchase amount to apply the voucher");
            }

            // Tính toán giảm giá của voucher
            BigDecimal discount = BigDecimal.ZERO;

            // Kiểm tra xem voucher có số tiền giảm giá cụ thể hay không
            if (voucher.getDiscountAmount() != null && voucher.getDiscountAmount().compareTo(String.valueOf(BigDecimal.ZERO)) > 0) {
                // Áp dụng giảm giá theo số tiền nếu có
                discount = new BigDecimal(voucher.getDiscountAmount());
            } else if (voucher.getDiscountPercent() != null && voucher.getDiscountPercent().compareTo(String.valueOf(BigDecimal.ZERO)) > 0) {
                // Nếu không có số tiền giảm, áp dụng giảm giá theo phần trăm
                BigDecimal percent = new BigDecimal(voucher.getDiscountPercent());
                discount = totalAmount.multiply(percent).divide(BigDecimal.valueOf(100), RoundingMode.HALF_UP);
            }

            // Áp dụng giới hạn giảm giá tối đa (nếu có)
            if (voucher.getMaxDiscountAmount() != null) {
                BigDecimal maxDiscount = new BigDecimal(voucher.getMaxDiscountAmount());
                discount = discount.min(maxDiscount); // Giảm không thể vượt quá maxDiscount
            }

            // Cập nhật tổng số tiền sau khi áp dụng voucher
            totalAmount = totalAmount.subtract(discount);

            // Giảm số lượng voucher và lưu lại
            voucher.setQuantity(voucher.getQuantity() - 1);
            voucherRepo.save(voucher);

            // Cập nhật voucher cho đơn hàng và khách hàng
            order.setVoucher(voucher);
            customer.getVouchers().add(voucher);
            customerRepo.save(customer);
        }

        // Cập nhật tổng số tiền của đơn hàng (chuyển đổi BigDecimal sang Double khi cần)
        order.setTotalAmount(totalAmount.doubleValue()); // Chuyển từ BigDecimal sang Double
        orderRepo.save(order);

        // Trả về phản hồi đơn hàng đã cập nhật
        return OrderResponse.convertOrderResponse(order);
    }





    @Override
    public Page<OrderResponse> pageAll(String staffName, LocalDate  startDate, LocalDate endDate, OrderStatus orderStatus, String orderCode, Pageable pageable) {
        Page<Orders> ordersPage = orderRepo.pageAll(staffName,startDate,endDate,orderStatus,orderCode,pageable);
        return ordersPage.map(OrderResponse::convertOrderResponse);
    }

    @Override
    public List<OrderResponse> getPendingOrdersByStaff(Integer staffId) {
        List<Orders> ordersList = orderRepo.findPendingOrdersByStaffId(staffId);
        return ordersList.stream().map(OrderResponse::convertOrderResponse).toList();
    }
}
