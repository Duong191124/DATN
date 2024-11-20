    package com.example.demo.service.impl;

    import com.example.demo.dto.PromotionDTO;
import com.example.demo.entity.ProductDetail;
import com.example.demo.entity.Promotion;
import com.example.demo.repository.ProductDetailRepo;
import com.example.demo.repository.PromotionRepo;
import com.example.demo.response.PromotionResponse;
import com.example.demo.service.PromotionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

    @RequiredArgsConstructor
    @Service
    public class PromotionServiceImpl implements PromotionService {

        private final PromotionRepo promotionRepo;
        private final ProductDetailRepo productDetailRepo;

        @Override
        public List<Promotion> getAll() {
            return promotionRepo.findAll();
        }


        @Override
        public PromotionResponse add(PromotionDTO promotionDTO) {
            Set<ProductDetail> productDetails = new HashSet<>();

            // Nếu danh sách productDetailsIds không rỗng, lấy từng product detail theo ID
            if (promotionDTO.getProductDetailsIds() != null && !promotionDTO.getProductDetailsIds().isEmpty()) {
                promotionDTO.getProductDetailsIds().forEach(productDetailId -> {
                    ProductDetail productDetail = productDetailRepo.findById(productDetailId).orElse(null);
                    if (productDetail != null) {
                        productDetails.add(productDetail);
                    }
                });
            }

            // Tạo mới khuyến mãi
            Promotion newPromotion = Promotion.builder()
                    .name(promotionDTO.getName())
                    .description(promotionDTO.getDescription())
                    .discountAmount(promotionDTO.getDiscountAmount())
                    .discountPercent(promotionDTO.getDiscountPercent())
                    .startDate(promotionDTO.getStartDate())
                    .endDate(promotionDTO.getEndDate())
                    .status(promotionDTO.getStatus())
                    .productDetails(productDetails)  // Sử dụng set productDetails
                    .build();

            Promotion savedPromotion = promotionRepo.save(newPromotion);
            return PromotionResponse.fromPromotionResponse(savedPromotion);
        }


        @Override
        public PromotionResponse update(Integer id, PromotionDTO promotionDTO) throws Exception {
            Promotion existingPromotion = getPromotionById(id);
            // Giữ nguyên giá trị cũ cho productDetails nếu không có ID mới
            Set<ProductDetail> productDetails = existingPromotion.getProductDetails();

            // Kiểm tra và cập nhật productDetails nếu có ID mới
            if (promotionDTO.getProductDetailsIds() != null) {
                if (!promotionDTO.getProductDetailsIds().isEmpty()) {
                    productDetails = new HashSet<>();
                    for (Integer productDetailId : promotionDTO.getProductDetailsIds()) {
                        ProductDetail productDetail = productDetailRepo.findById(productDetailId).orElse(null);
                        if (productDetail != null) {
                            productDetails.add(productDetail);
                        }
                    }
                }
            }

            // Cập nhật các trường khác của khuyến mãi
            existingPromotion.setName(promotionDTO.getName());
            existingPromotion.setDescription(promotionDTO.getDescription());
            existingPromotion.setDiscountAmount(promotionDTO.getDiscountAmount());
            existingPromotion.setDiscountPercent(promotionDTO.getDiscountPercent());
            existingPromotion.setStartDate(promotionDTO.getStartDate());
            existingPromotion.setEndDate(promotionDTO.getEndDate());
            existingPromotion.setStatus(promotionDTO.getStatus());
            existingPromotion.setProductDetails(productDetails);

            Promotion updatedPromotion = promotionRepo.save(existingPromotion);

            // Sử dụng phương thức đã cập nhật
            return PromotionResponse.fromPromotionResponse(updatedPromotion);
        }

        @Override
        public PromotionResponse updateProductDetails(Integer promotionId, List<Integer> productDetailsIds, Boolean applyPromotion) throws Exception {
            Promotion existingPromotion = getPromotionById(promotionId);
            Set<ProductDetail> updatedProductDetails = new HashSet<>();

            // Nếu productDetailsIds là null hoặc rỗng
            if (productDetailsIds == null || productDetailsIds.isEmpty()) {

                // Khôi phục tất cả productDetails về giá gốc khi không áp dụng khuyến mãi
                if (Boolean.FALSE.equals(applyPromotion)) {
                    if (existingPromotion.getProductDetails() != null) {
                        for (ProductDetail productDetail : existingPromotion.getProductDetails()) {
                            productDetail.setDiscountPrice(productDetail.getDefaultPrice());
                            productDetailRepo.save(productDetail);
                        }
                    }
                    // Xoá tất cả liên kết productDetails khỏi promotion
                    existingPromotion.getProductDetails().clear();
                    promotionRepo.save(existingPromotion);
                }

                return PromotionResponse.fromPromotionResponse(existingPromotion);
            }

            // Nếu danh sách không rỗng, tiến hành áp dụng khuyến mãi hoặc khôi phục giá
            for (Integer productDetailId : productDetailsIds) {
                ProductDetail productDetail = productDetailRepo.findById(productDetailId).orElse(null);

                if (productDetail != null) {
                    if (Boolean.TRUE.equals(applyPromotion)) {
                        // Áp dụng khuyến mãi
                        double discountPrice = productDetail.getDefaultPrice();

                        if (existingPromotion.getDiscountAmount() != null && Double.parseDouble(existingPromotion.getDiscountAmount()) > 0) {
                            double amount = Double.parseDouble(existingPromotion.getDiscountAmount());
                            discountPrice = Math.max(discountPrice - amount, 0);
                        } else if (existingPromotion.getDiscountPercent() != null && Double.parseDouble(existingPromotion.getDiscountPercent()) > 0) {
                            double percent = Double.parseDouble(existingPromotion.getDiscountPercent());
                            discountPrice = Math.max(discountPrice * (1 - (percent / 100)), 0);
                        }

                        productDetail.setDiscountPrice(discountPrice);
                        updatedProductDetails.add(productDetail);
                    } else {
                        // Khôi phục giá gốc nếu không áp dụng khuyến mãi
                        productDetail.setDiscountPrice(productDetail.getDefaultPrice());
                        updatedProductDetails.remove(productDetail);
                    }

                    productDetailRepo.save(productDetail); // Lưu từng sản phẩm đã cập nhật
                } else {
                }
            }

            if (Boolean.TRUE.equals(applyPromotion)) {
                // Nếu áp dụng khuyến mãi, cập nhật lại productDetails của promotion
                existingPromotion.setProductDetails(updatedProductDetails);
                promotionRepo.save(existingPromotion);
            } else {
                // Nếu không áp dụng khuyến mãi, xóa các liên kết productDetails khỏi promotion
                existingPromotion.getProductDetails().removeAll(updatedProductDetails);
                promotionRepo.save(existingPromotion);
            }

            return PromotionResponse.fromPromotionResponse(existingPromotion);
        }

//        @Override
//        public PromotionResponse updateProductDetails(Integer promotionId, List<Integer> productDetailsIds, Boolean applyPromotion) throws Exception {
//            Promotion existingPromotion = getPromotionById(promotionId);
//            Set<ProductDetail> updatedProductDetails = new HashSet<>();
//
//            // Nếu productDetailsIds là null hoặc rỗng
//            if (productDetailsIds == null || productDetailsIds.isEmpty()) {
//
//                // Khôi phục tất cả productDetails về giá gốc khi không áp dụng khuyến mãi
//                if (Boolean.FALSE.equals(applyPromotion)) {
//                    if (existingPromotion.getProductDetails() != null) {
//                        for (ProductDetail productDetail : existingPromotion.getProductDetails()) {
//                            productDetail.setDiscountPrice(productDetail.getDefaultPrice());
//                            productDetailRepo.save(productDetail);
//                        }
//                    }
//                    // Xoá tất cả liên kết productDetails khỏi promotion
//                    existingPromotion.getProductDetails().clear();
//                    promotionRepo.save(existingPromotion);
//                }
//
//                return PromotionResponse.fromPromotionResponse(existingPromotion);
//            }
//
//            // Nếu danh sách không rỗng, tiến hành áp dụng khuyến mãi hoặc khôi phục giá
//            for (Integer productDetailId : productDetailsIds) {
//                ProductDetail productDetail = productDetailRepo.findById(productDetailId).orElse(null);
//
//                if (productDetail != null) {
//                    if (Boolean.TRUE.equals(applyPromotion)) {
//                        // Kiểm tra nếu productDetail đã được liên kết với khuyến mãi khác
//                        Set<Promotion> currentPromotions = productDetail.getPromotions();
//                        if (currentPromotions != null && !currentPromotions.isEmpty()) {
//                            throw new Exception("ProductDetail ID " + productDetailId + " đã được áp dụng khuyến mãi khác.");
//                        }
//
//                        // Áp dụng khuyến mãi
//                        double discountPrice = productDetail.getDefaultPrice();
//
//                        if (existingPromotion.getDiscountAmount() != null && Double.parseDouble(existingPromotion.getDiscountAmount()) > 0) {
//                            double amount = Double.parseDouble(existingPromotion.getDiscountAmount());
//                            discountPrice = Math.max(discountPrice - amount, 0);
//                        } else if (existingPromotion.getDiscountPercent() != null && Double.parseDouble(existingPromotion.getDiscountPercent()) > 0) {
//                            double percent = Double.parseDouble(existingPromotion.getDiscountPercent());
//                            discountPrice = Math.max(discountPrice * (1 - (percent / 100)), 0);
//                        }
//
//                        productDetail.setDiscountPrice(discountPrice);
//                        updatedProductDetails.add(productDetail);
//
//                    } else {
//                        // Khôi phục giá gốc nếu không áp dụng khuyến mãi
//                        productDetail.setDiscountPrice(productDetail.getDefaultPrice());
//                        updatedProductDetails.remove(productDetail);
//                    }
//
//                    productDetailRepo.save(productDetail); // Lưu từng sản phẩm đã cập nhật
//                } else {
//                    throw new Exception("ProductDetail ID " + productDetailId + " không tồn tại.");
//                }
//            }
//
//            if (Boolean.TRUE.equals(applyPromotion)) {
//                // Nếu áp dụng khuyến mãi, cập nhật lại productDetails của promotion
//                existingPromotion.getProductDetails().addAll(updatedProductDetails);
//                promotionRepo.save(existingPromotion);
//            } else {
//                // Nếu không áp dụng khuyến mãi, xóa các liên kết productDetails khỏi promotion
//                existingPromotion.getProductDetails().removeAll(updatedProductDetails);
//                promotionRepo.save(existingPromotion);
//            }
//
//            return PromotionResponse.fromPromotionResponse(existingPromotion);
//        }
        @Override
        public Promotion getPromotionById(Integer id) throws Exception {
            return promotionRepo.findById(id)
                    .orElseThrow(() -> new Exception("Promotion not found"));
        }

        @Override
        public void deletePromotion(Integer id) throws Exception {
            Promotion existingPromotion = getPromotionById(id);
            // Chỉ xóa khuyến mãi, không làm ảnh hưởng đến ProductDetail
            promotionRepo.delete(existingPromotion);
        }
        @Override
        public PromotionResponse changeStatus(Integer id) throws Exception {
            Promotion promotion = getPromotionById(id); // Kiểm tra nếu promotion tồn tại
            int currentStatus = promotion.getStatus();
            int newStatus = currentStatus == 1 ? 0 : 1; // Đổi trạng thái từ 1 sang 0 và ngược lại

            promotion.setStatus(newStatus);

            // Nếu trạng thái mới là 0 (hủy bỏ), khôi phục giá gốc cho các sản phẩm
            if (newStatus == 0 && promotion.getProductDetails() != null) {
                for (ProductDetail productDetail : promotion.getProductDetails()) {
                    // Khôi phục giá gốc
                    productDetail.setDiscountPrice(productDetail.getDefaultPrice());
                    productDetailRepo.save(productDetail); // Lưu thay đổi của productDetail
                }

                // Xóa tất cả các liên kết productDetails khỏi promotion
                promotion.getProductDetails().clear();
            }

            // Lưu lại promotion với trạng thái mới
            Promotion updatedPromotion = promotionRepo.save(promotion);
            return PromotionResponse.fromPromotionResponse(updatedPromotion);
        }

    }
