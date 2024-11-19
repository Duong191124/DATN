package com.example.demo.service.impl;

import com.example.demo.dto.ProductDetailDTO;
import com.example.demo.entity.*;
import com.example.demo.repository.*;
import com.example.demo.response.ProductDetailResponse;
import com.example.demo.response.ProductResponse;
import com.example.demo.response.PromotionResponse;
import com.example.demo.service.ProductDetailService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class ProductDetailServiceImpl implements ProductDetailService {
    private final ProductDetailRepo productDetailRepo;

    @Autowired
    private CloudinaryServiceImpl cloudinaryService;

    @Autowired
    private ProductRepo productRepo;

    @Autowired
    private SizeRepo sizeRepo;

    @Autowired
    private ColorRepo colorRepo;

    @Autowired
    private WeightRepo weightRepo;
    @Autowired
    private OrderDetailRepo orderDetailRepo;

    @Override
    public List<ProductDetailResponse> getAll() {
        return productDetailRepo.findAll().stream().map(ProductDetailResponse::fromProductDetailResponse).collect(Collectors.toList());
    }

    @Override
    public ProductDetail addProductDetail(ProductDetailDTO productDetailDTO) throws Exception {
        ProductDetail newProductDetail = new ProductDetail();
        newProductDetail.setCode(productDetailDTO.getCode());
        newProductDetail.setQuantity(productDetailDTO.getQuantity());
        newProductDetail.setDefaultPrice(productDetailDTO.getDefaultPrice());
//        newProductDetail.setDiscountPrice(productDetailDTO.getDiscountPrice());
        newProductDetail.setImage(productDetailDTO.getImage());

        // Liên kết với các entity khác
        newProductDetail.setProduct(getProductById(productDetailDTO.getProductId()));
        newProductDetail.setSize(getSizeById(productDetailDTO.getSizeId()));
        newProductDetail.setColor(getColorById(productDetailDTO.getColorId()));
        newProductDetail.setWeightValue(getWeightById(productDetailDTO.getWeightId()));

        return productDetailRepo.save(newProductDetail);
    }

    public ProductDetail update(Integer id, ProductDetailDTO productDetailDTO) throws Exception {
        // Tìm kiếm productDetail dựa trên ID
        ProductDetail existingProductDetail = productDetailRepo.findById(id)
                .orElseThrow(() -> new Exception("ProductDetail not found"));

        // Cập nhật thông tin từ DTO sang entity
        existingProductDetail.setCode(productDetailDTO.getCode());
        existingProductDetail.setQuantity(productDetailDTO.getQuantity());
        existingProductDetail.setDefaultPrice(productDetailDTO.getDefaultPrice());
//        existingProductDetail.setDiscountPrice(productDetailDTO.getDiscountPrice());
        existingProductDetail.setImage(productDetailDTO.getImage());
        existingProductDetail.setStatus(productDetailDTO.getStatus());
        existingProductDetail.setProduct(getProductById(productDetailDTO.getProductId()));
        existingProductDetail.setSize(getSizeById(productDetailDTO.getSizeId()));
        existingProductDetail.setColor(getColorById(productDetailDTO.getColorId()));
        existingProductDetail.setWeightValue((getWeightById(productDetailDTO.getWeightId())));
        // Lưu lại productDetail đã cập nhật
        return productDetailRepo.save(existingProductDetail);
    }

    @Override
    public ProductDetailResponse getPDById(Integer id) throws Exception {
        ProductDetail productDetail = productDetailRepo.findById(id)
                .orElseThrow(() -> new Exception("ProductDetail not found with id: " + id));
        return ProductDetailResponse.fromProductDetailResponse(productDetail);
    }

    @Override
    public ProductDetailResponse getPDByCode(String code) {
        return ProductDetailResponse.fromProductDetailResponse(productDetailRepo.findProductDetailByCode(code));
    }

    @Override
    public List<ProductDetailResponse> getTopFeaturedProducts(
            Pageable pageable) {
        // Lấy kết quả từ truy vấn SQL
        List<Object[]> results = orderDetailRepo.getTopFeaturedProducts(pageable);
        List<ProductDetailResponse> featuredProducts = new ArrayList<>();

        // Tạo đối tượng response cho mỗi sản phẩm
        for (Object[] result : results) {
            ProductDetail product = (ProductDetail) result[0];  // Lấy đối tượng sản phẩm
            Long totalSold = (Long) result[1];  // Lấy số lượng đã bán từ kết quả truy vấn
            ProductDetailResponse response = new ProductDetailResponse();
            response.setId(product.getId());
            response.setCode(product.getCode());
            response.setDiscountPrice(product.getDiscountPrice());
            response.setQuantity(product.getQuantity()); // Giữ nguyên số lượng ban đầu
            response.setColor(product.getColor());
            response.setSize(product.getSize());
            response.setImage(product.getImage());
            response.setDefaultPrice(product.getDefaultPrice());
            response.setWeight(product.getWeightValue());
            response.setProductResponse(ProductResponse.convertResponse(product.getProduct()));
            response.setPromotions(product.getPromotions().stream()
                    .map(PromotionResponse::fromPromotionResponse)
                    .collect(Collectors.toSet()));

            response.setCreateAt(product.getCreatedAt()); // Lấy ngày tạo sản phẩm

            // Thêm vào danh sách các sản phẩm
            featuredProducts.add(response);
        }

        // Sắp xếp các sản phẩm theo tổng số lượng đã bán (totalSold), ngày tạo (createdAt) và giá giảm (discountPrice)
        featuredProducts.sort((response1, response2) -> {
            // Lấy số lượng đã bán từ đối tượng response đã được tạo
            Long totalSold1 = (Long) results.get(featuredProducts.indexOf(response1))[1]; // Dùng giá trị thứ hai trong kết quả truy vấn
            Long totalSold2 = (Long) results.get(featuredProducts.indexOf(response2))[1]; // Dùng giá trị thứ hai trong kết quả truy vấn

            // So sánh theo totalSold (số lượng đã bán)
            int comparison = totalSold2.compareTo(totalSold1);
            if (comparison != 0) {
                return comparison;
            }

            // Nếu totalSold bằng nhau, sắp xếp theo createdAt
            comparison = response2.getCreateAt().compareTo(response1.getCreateAt());
            if (comparison != 0) {
                return comparison;
            }

            // Nếu cả totalSold và createdAt đều bằng nhau, sắp xếp theo discountPrice
            return response1.getDiscountPrice().compareTo(response2.getDiscountPrice());
        });

        return featuredProducts;
    }

    @Override
    public void deletePD(Integer id) throws Exception {
        ProductDetail productDetail = productDetailRepo.findById(id)
                .orElseThrow(() -> new Exception("ProductDetail not found with id: " + id));
        productDetailRepo.delete(productDetail);
    }


    @Override
    public ProductDetail uploadImageForProductDetail(Integer ProductId, Integer productDetailId, MultipartFile file) throws Exception {
        String imageUrl = cloudinaryService.uploadImage(file);

        ProductDetail productDetail = productDetailRepo.findByIdAndProductId(productDetailId, ProductId)
                .orElseThrow(() -> new Exception("Product detail not found"));

        productDetail.setImage(imageUrl);
        return productDetailRepo.save(productDetail);
    }

    @Override
    public Page<ProductDetailResponse> pageAndFilterWithProductDetailResponse(String productName, String code, String colorName, String weightName, String sizeName, Double minPrice, Double maxPrice, Integer status, Pageable pageable) {
        Page<ProductDetail> productDetailPage = productDetailRepo.pageAndFilterProductDetail(productName, code, colorName, sizeName, weightName, minPrice, maxPrice, status, pageable);
        return productDetailPage.map(ProductDetailResponse::fromProductDetailResponse);
    }

    public Product getProductById(Integer id) throws Exception {
        return productRepo.findById(id)
                .orElseThrow(() -> new Exception("Product not found with id: " + id));
    }

    public Size getSizeById(Integer id) throws Exception {
        return sizeRepo.findById(id)
                .orElseThrow(() -> new Exception("Size not found with id: " + id));
    }

    public Color getColorById(Integer id) throws Exception {
        return colorRepo.findById(id)
                .orElseThrow(() -> new Exception("Color not found with id: " + id));
    }

    public Weight getWeightById(Integer id) throws Exception {
        return weightRepo.findById(id)
                .orElseThrow(() -> new Exception("weight not found with id: " + id));
    }
}
