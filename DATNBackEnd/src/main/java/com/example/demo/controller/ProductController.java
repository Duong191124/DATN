package com.example.demo.controller;

import com.example.demo.dto.ProductDTO;
import com.example.demo.entity.Product;
import com.example.demo.entity.ProductDetail;
import com.example.demo.response.MessageReponse;
import com.example.demo.response.PageProductResponse;
import com.example.demo.response.ProductDetailResponse;
import com.example.demo.response.ProductResponse;
import com.example.demo.service.ProductService;
import com.example.demo.service.impl.ProductDetailServiceImpl;
import com.example.demo.service.impl.ProductServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("${api.prefix}/products")
@RequiredArgsConstructor
public class ProductController {

    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024;

    private final ProductService productService;
    private final ProductServiceImpl productServiceImpl;
    private final ProductDetailServiceImpl productDetailService;

    @PostMapping("/check-duplicate")
    public ResponseEntity<Map<String, Boolean>> checkDuplicateSize(@RequestBody Map<String, String> request) {
        String type = request.get("type");
        String value = request.get("value");

        boolean exists = productServiceImpl.isDuplicate(type, value);
        Map<String, Boolean> response = new HashMap<>();
        response.put("exists", exists);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/getAllProduct")
    public ResponseEntity<?> getAllProduct() {
        List<Product> products = productService.getAll();
        return ResponseEntity.status(HttpStatus.OK).body(MessageReponse.builder()
                .message("Lay thong tin thanh cong")
                .status(HttpStatus.OK.value())
                .data(products)
                .build());
    }


    @GetMapping("")
    public ResponseEntity<PageProductResponse> pageAllProduct(
            @RequestParam(defaultValue = "", value = "category_id") Integer categoryId,
            @RequestParam(defaultValue = "", value = "name") String productName,
            @RequestParam(defaultValue = "", value = "sleeve_id") Integer sleeveId,
            @RequestParam(defaultValue = "", value = "collar_id") Integer collarId,
            @RequestParam(defaultValue = "", value = "brand_id") Integer brandId,
            @RequestParam(defaultValue = "", value = "status") Integer status,
            @RequestParam(defaultValue = "") Double price,
            @RequestParam(defaultValue = "") String description,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "3") int pageSize) {
        // Đảm bảo page không nhỏ hơn 1
        page = Math.max(1, page);
        Pageable pageable = PageRequest.of(page - 1, pageSize, Sort.by("id").ascending());

        Page<ProductResponse> productResponsePage = productService.pageAllProducts(
                categoryId, productName, sleeveId, collarId, brandId, price, description, status,pageable);

        int pageCurrent = productResponsePage.getNumber() + 1; // Cộng thêm 1 để trả về trang bắt đầu từ 1
        int pageSizeCurrent = productResponsePage.getSize();
        long totalElement = productResponsePage.getTotalElements();
        List<ProductResponse> productResponseList = productResponsePage.getContent();

        return ResponseEntity.ok(PageProductResponse.builder()
                .productResponseList(productResponseList)
                .page(pageCurrent)
                .pageSize(pageSizeCurrent)
                .totalElement(totalElement)
                .build());
    }
    @PreAuthorize("hasAuthority('CREATE_PRODUCT')")
    @PostMapping("")
    public ResponseEntity<?> addProduct(@Valid @RequestBody ProductDTO productDTO, BindingResult result) {
        if (result.hasErrors()) {
            List<String> errorMessage = result.getFieldErrors().stream().map(FieldError::getDefaultMessage).toList();
            return ResponseEntity.badRequest().body(errorMessage);
        }
        try {
            ProductResponse createProductResponse = productService.createdProduct(productDTO);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new MessageReponse("add successfully", 1, createProductResponse));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PreAuthorize("hasAuthority('CREATE_PRODUCT')")
    @PostMapping(value = "upload/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadImage(@PathVariable() int id, @ModelAttribute("file") MultipartFile file) {
        try {
            if (file.getSize() > MAX_FILE_SIZE) {
                return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE).body("File is too large! Maximum size is 5MB");
            }
            Product newProduct = productService.uploadImageProduct(id, file);
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new MessageReponse("Upload image product successfully", HttpStatus.OK.value(), newProduct));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
    @PreAuthorize("hasAuthority('CREATE_PRODUCT')")
    @PostMapping(value = "uploadForProductDetail/{productId}/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadImageForProductDetail(@PathVariable("productId") int productId,
                                                         @PathVariable("id") int productDetailId,
                                                         @ModelAttribute("file") MultipartFile file) {
        try {
            if (file.getSize() > MAX_FILE_SIZE) {
                return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE).body("File is too large! Maximum size is 5MB");
            }
            ProductDetail newProductDetail = productDetailService.uploadImageForProductDetail(productId, productDetailId, file);
            ProductDetailResponse productDetailResponse = ProductDetailResponse.fromProductDetailResponse(newProductDetail);
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new MessageReponse("Upload image productDetail successfully", HttpStatus.OK.value(), productDetailResponse));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
    @PreAuthorize("hasAuthority('UPDATE_PRODUCT')")
    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable Integer id, @Valid @RequestBody ProductDTO productDTO, BindingResult result) {
        if (result.hasErrors()) {
            List<String> errorMessage = result.getFieldErrors().stream().map(FieldError::getDefaultMessage).toList();
            return ResponseEntity.badRequest().body(errorMessage);
        }
        try {
            ProductResponse productResponse = productService.updatedProduct(id, productDTO);
            return ResponseEntity.ok(new MessageReponse("Updated successfully", 1, productResponse));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
    @PreAuthorize("hasAuthority('DELETE_PRODUCT')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable int id) {
        try {
            productService.deletedProduct(id);
            return ResponseEntity.status(HttpStatus.OK).body(MessageReponse.builder()
                    .message("delete product successfully")
                    .status(HttpStatus.OK.value())
                    .build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
    @GetMapping("productId/{id}")
    public ResponseEntity<?> getById(@PathVariable Integer id){
        try {
            ProductResponse product = productService.findById(id);
            return ResponseEntity.ok()
                    .body(MessageReponse.builder()
                            .message("Lay thong tin thanh cong")
                            .status(HttpStatus.OK.value())
                            .data(product)
                            .build());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }
    @GetMapping("/{productId}")
    public ResponseEntity<?> getProductById(@PathVariable Integer productId) {
        try {
            ProductResponse product = productService.findById(productId);
            List<ProductDetailResponse> productDetails = productService.getProductDetailsByProductId(productId)
                    .stream()
                    .map(ProductDetailResponse::fromProductDetailResponse)
                    .toList();

            Map<String, Object> response = new HashMap<>();
            response.put("product", product);
            response.put("details", productDetails);

            return ResponseEntity.ok(new MessageReponse("Lay thong tin thanh cong", HttpStatus.OK.value(), response));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found");
        }
    }
    @GetMapping("/productDetail")
    public ResponseEntity<?> getAllProducts(@RequestParam(defaultValue = "0") int page,
                                            @RequestParam(defaultValue = "12") int size,
                                            @RequestParam(defaultValue = "ASC") String sortDirection) {
        try {
            // Phân trang cho sản phẩm
            Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Order.asc("name"))); // Sắp xếp theo tên sản phẩm (có thể thay đổi)
            Page<ProductResponse> productPage = productService.productAllWithProductDetailAll(pageable);

            // Lấy danh sách chi tiết sản phẩm và sắp xếp theo giá cho từng sản phẩm
            List<Map<String, Object>> productsWithDetails = productPage.getContent().stream()
                    .map(product -> {
                        // Lấy chi tiết sản phẩm cho mỗi sản phẩm
                        List<ProductDetailResponse> productDetails = productService.getProductDetailsByProductId(product.getId())
                                .stream()
                                .map(ProductDetailResponse::fromProductDetailResponse)
                                .sorted((detail1, detail2) -> {
                                    // Lấy giá từ discountPrice nếu có, nếu không lấy defaultPrice
                                    double price1 = (detail1.getDiscountPrice() != null) ? detail1.getDiscountPrice() : detail1.getDefaultPrice();
                                    double price2 = (detail2.getDiscountPrice() != null) ? detail2.getDiscountPrice() : detail2.getDefaultPrice();

                                    // Sắp xếp theo hướng tăng hoặc giảm giá
                                    if ("ASC".equalsIgnoreCase(sortDirection)) {
                                        return Double.compare(price1, price2);
                                    } else {
                                        return Double.compare(price2, price1);
                                    }
                                })
                                .collect(Collectors.toList());
                        int totalQuantity = productDetails.stream()
                                .mapToInt(ProductDetailResponse::getQuantity)  // Lấy số lượng từ mỗi chi tiết sản phẩm
                                .sum();
                        // Lấy giá thấp và cao nhất
                        double minPrice = productDetails.stream()
                                .mapToDouble(detail -> (detail.getDiscountPrice() != null && detail.getDiscountPrice() > 0) ? detail.getDiscountPrice() : detail.getDefaultPrice())
                                .min()
                                .orElse(0);
                        double maxPrice = productDetails.stream()
                                .mapToDouble(detail -> (detail.getDiscountPrice() != null && detail.getDiscountPrice() > 0) ? detail.getDiscountPrice() : detail.getDefaultPrice())
                                .max()
                                .orElse(0);

                        // Trả về một bản đồ chứa thông tin sản phẩm và chi tiết
                        Map<String, Object> productWithDetails = new HashMap<>();
                        productWithDetails.put("products", product);
                        productWithDetails.put("details", productDetails);
                        productWithDetails.put("minPrice", minPrice);
                        productWithDetails.put("maxPrice", maxPrice);
                        productWithDetails.put("totalQuantity", totalQuantity);
                        return productWithDetails;
                    })
                    .collect(Collectors.toList());

            // Tạo response
            Map<String, Object> response = new HashMap<>();
            response.put("products", productsWithDetails);
            response.put("totalPages", productPage.getTotalPages());
            response.put("totalElements", productPage.getTotalElements());

            return ResponseEntity.ok(new MessageReponse("Lấy thông tin thành công", HttpStatus.OK.value(), response));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Products not found");
        }
    }



}
