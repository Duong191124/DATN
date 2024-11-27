package com.example.demo.service.impl;

import com.example.demo.dto.OrderDTO;
import com.example.demo.dto.OrderOnlineDTO;
import com.example.demo.entity.*;
import com.example.demo.repository.*;
import com.example.demo.request.OrderDetailOnlineRequest;
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
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Iterator;
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
        Customer customer = customerRepo.findById(customerId).get();
        Orders order = new Orders();
        order.setCode(orderDTO.getCode());
        order.setOrderDate(orderDTO.getOrderDate());
        if (orderDTO.getStaffId() != null && orderDTO.getStaffId() > 0) {
            Staff staff = staffRepo.findById(orderDTO.getStaffId())
                    .orElseThrow(() -> new RuntimeException("Staff not found with id: " + orderDTO.getStaffId()));
            order.setStaff(staff);
        } else {
            order.setStaff(null); // Nếu không có staffId, gán staff là null
        }
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

    @Transactional
    public OrderResponse createOrderOnline(OrderOnlineDTO orderDTO) {
        Integer customerId = orderDTO.getCustomerId() != null ? orderDTO.getCustomerId() : 1;

        // Tạo mới đơn hàng
        Orders order = new Orders();
        order.setCode(orderDTO.getCode());
        order.setDeliveryFee(orderDTO.getDeliveryFee());
        order.setOrderDate(orderDTO.getOrderDate());
        order.setTotalAmount(orderDTO.getTotalAmount());
        order.setMoneyReceived(orderDTO.getMoneyReceived());  // Có thể cập nhật sau nếu cần
        if (orderDTO.getVoucherId() != null) {
            Voucher voucher = voucherRepo.findById(orderDTO.getVoucherId())
                    .orElseThrow(() -> new RuntimeException("Voucher not found"));
            order.setVoucher(voucher);
        } else {
            order.setVoucher(null);
        }
        order.setCustomer(customerRepo.findById(customerId).orElse(null));
        order.setStatus(OrderStatus.pending);  // Mặc định trạng thái là 'process'

        // Lưu đơn hàng vào DB
        Orders savedOrder = orderRepo.save(order);

        if (orderDTO.getOrderDetailRequests() == null || orderDTO.getOrderDetailRequests().isEmpty()) {
            throw new RuntimeException("No order details provided");
        }

        // Xử lý chi tiết đơn hàng
        for (OrderDetailOnlineRequest onlineRequest : orderDTO.getOrderDetailRequests()) {
            try {
                if (onlineRequest.getProductDetailId() == null) {
                    throw new RuntimeException("ProductDetail ID cannot be null");
                }

                // Tìm ProductDetail theo ID
                ProductDetail productDetail = productDetailRepo.findById(onlineRequest.getProductDetailId())
                        .orElseThrow(() -> new RuntimeException("Product detail with ID " + onlineRequest.getProductDetailId() + " not found"));

                // Kiểm tra số lượng sản phẩm trong kho
                if (productDetail.getQuantity() < onlineRequest.getQuantity()) {
                    throw new RuntimeException("Insufficient stock for product: " + productDetail.getProduct().getName());
                }

                // Tạo chi tiết đơn hàng
                OrderDetail orderDetail = new OrderDetail();
                orderDetail.setOrders(savedOrder);
                orderDetail.setProductDetail(productDetail);
                orderDetail.setQuantity(onlineRequest.getQuantity());
                orderDetail.setPrice(onlineRequest.getPrice());

                // Lưu chi tiết đơn hàng vào DB
                orderDetailRepo.save(orderDetail);

                // Cập nhật số lượng sản phẩm trong kho
                productDetail.setQuantity(productDetail.getQuantity() - onlineRequest.getQuantity());
                productDetailRepo.save(productDetail);  // Lưu lại sản phẩm sau khi trừ số lượng

            } catch (Exception e) {
                // Log lỗi chi tiết sản phẩm không hợp lệ hoặc lỗi khi lưu chi tiết
                System.err.println("Error processing order detail: " + e.getMessage());
                throw new RuntimeException("Error processing order detail: " + e.getMessage());
            }
        }
        return OrderResponse.convertOrderResponse(savedOrder);
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
        // Lấy đơn hàng từ cơ sở dữ liệu
        Orders orders = orderRepo.findById(id).orElseThrow(() ->
                new RuntimeException("Not found order with id: " + id)
        );

        // Chuyển đổi trạng thái từ String thành OrderStatus enum
        OrderStatus orderStatus = OrderStatus.valueOf(status.toLowerCase());

        // Kiểm tra nếu trạng thái là "hủy"
        if (orderStatus == OrderStatus.cancelled) {
            // Duyệt qua các chi tiết đơn hàng để cập nhật số lượng sản phẩm
            Iterator<OrderDetail> iterator = orders.getOrderDetails().iterator();
            while (iterator.hasNext()) {
                OrderDetail orderDetail = iterator.next();
                ProductDetail productDetail = orderDetail.getProductDetail();
                int quantityOrdered = orderDetail.getQuantity();

                // Cập nhật lại số lượng sản phẩm trong kho (tăng lại số lượng)
                productDetail.setQuantity(productDetail.getQuantity() + quantityOrdered);
                productDetailRepo.save(productDetail);  // Lưu sản phẩm sau khi cập nhật
                // Xóa OrderDetail khỏi Order
                iterator.remove();  // Xóa OrderDetail khỏi danh sách
            }
        }
        // Cập nhật trạng thái đơn hàng
        orders.setStatus(orderStatus);
        orderRepo.save(orders); // Lưu đơn hàng đã cập nhật
        // Trả về đối tượng OrderResponse đã cập nhật
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
    public OrderResponse updateCustomerId(Integer orderId, Integer customerId) {
        Customer customer = customerRepo.findById(customerId).orElseThrow(()->new RuntimeException("Not found customer with id:"+customerId));
        Orders orders = orderRepo.findById(orderId).orElseThrow(()->new RuntimeException("Not found orders with id:"+orderId));
        orders.setCustomer(customer);
        return OrderResponse.convertOrderResponse(orderRepo.save(orders));
    }

    @Override
    @Transactional
    public OrderResponse updatedOrderWithProductDetail(Integer id, OrderWithVoucherAndOrderDetailRequest orderUpdateRequest) {
        // Tìm đơn hàng theo ID
        Orders order = orderRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        Customer customer = customerRepo.findById(order.getCustomer().getId())
                .orElseThrow(() -> new RuntimeException("Not found customer with id: " + order.getCustomer().getId()));

        // Nếu là thanh toán qua VNPay, không cho phép cập nhật bất kỳ thông tin nào

        // Nếu không phải VNPay, thực hiện các cập nhật như bình thường
        List<OrderDetail> orderDetailsToSave = new ArrayList<>();
        Double totalAmount = orderUpdateRequest.getTotal();

        // Xử lý chi tiết sản phẩm trong yêu cầu
        for (OrderDetailRequest detailRequest : orderUpdateRequest.getOrderDetailRequests()) {
            ProductDetail productDetail = productDetailRepo.findById(detailRequest.getProductDetailId())
                    .orElseThrow(() -> new RuntimeException("Product detail not found"));

            // Kiểm tra tính khả dụng của sản phẩm (số lượng)
            if (detailRequest.getQuantity() > productDetail.getQuantity()) {
                throw new RuntimeException("Insufficient quantity for product detail ID " + detailRequest.getProductDetailId());
            }

            // Giảm số lượng sản phẩm khi không phải VNPay
            productDetail.setQuantity(productDetail.getQuantity() - detailRequest.getQuantity());
            if (productDetail.getQuantity() == 0) {
                productDetail.setStatus(0);  // Đánh dấu sản phẩm hết hàng
            }
            productDetailRepo.save(productDetail);

            // Thêm chi tiết đơn hàng vào danh sách
            OrderDetail orderDetail = new OrderDetail();
            orderDetail.setOrders(order);
            orderDetail.setProductDetail(productDetail);

            BigDecimal discountPriceBigDecimal = (productDetail.getDiscountPrice() != null)
                    ? BigDecimal.valueOf(productDetail.getDiscountPrice())
                    : BigDecimal.ZERO;
            BigDecimal priceToUse = (discountPriceBigDecimal.compareTo(BigDecimal.ZERO) > 0)
                    ? discountPriceBigDecimal // Giữ nguyên BigDecimal nếu có giá giảm
                    : BigDecimal.valueOf(productDetail.getDefaultPrice());

            orderDetail.setPrice(priceToUse.doubleValue());  // Chuyển đổi BigDecimal thành Double khi lưu vào OrderDetail
            orderDetail.setQuantity(detailRequest.getQuantity());

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

            // Giảm số lượng voucher và lưu lại
            voucher.setQuantity(voucher.getQuantity() - 1);
            voucherRepo.save(voucher);

            // Cập nhật voucher cho đơn hàng và khách hàng
            order.setVoucher(voucher);
            customer.getVouchers().add(voucher);
            customerRepo.save(customer);
        }
            order.setTotalAmount(totalAmount);

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
