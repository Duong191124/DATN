package com.example.demo.controller;

import com.example.demo.dto.PromotionDTO;
import com.example.demo.response.MessageReponse;
import com.example.demo.response.PromotionResponse;
import com.example.demo.service.impl.PromotionServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.prefix}/promotion")
@RequiredArgsConstructor
public class PromotionController {

    private final PromotionServiceImpl promotionService;

    @GetMapping("")
    public ResponseEntity<?> getAll(){
        List<PromotionResponse> promotionList = promotionService.getAll().stream().map(PromotionResponse::fromPromotionResponse).toList();
        return ResponseEntity.status(HttpStatus.OK).body(MessageReponse.builder()
                .message("Lay thong tin thanh cong")
                .status(HttpStatus.OK.value())
                .data(promotionList)
                .build());
    }
    //@PreAuthorize("hasAuthority('CREATE_PROMOTION')")
    @PostMapping("")
    public ResponseEntity<MessageReponse> add(@Valid @RequestBody PromotionDTO promotionDTO, BindingResult result) {
        if (result.hasErrors()) {
            List<String> errorMessage = result.getFieldErrors()
                    .stream()
                    .map(FieldError::getDefaultMessage)
                    .toList();
            return ResponseEntity.badRequest().body(MessageReponse.builder()
                    .message(errorMessage.toString())
                    .status(HttpStatus.BAD_REQUEST.value())
                    .build());
        }

        PromotionResponse newPromotion = promotionService.add(promotionDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(MessageReponse.builder()
                .message("Create promotion successfully")
                .status(HttpStatus.CREATED.value())
                .data(newPromotion)
                .build());
    }
    //@PreAuthorize("hasAuthority('UPDATE_PROMOTION')")
    @PutMapping("{id}")
    public ResponseEntity<?> update(
            @PathVariable("id") Integer id,
            @RequestBody @Valid PromotionDTO promotionDTO,
            BindingResult result) throws Exception{
        if (result.hasErrors()) {
            List<String> errorMessage = result.getFieldErrors()
                    .stream()
                    .map(FieldError::getDefaultMessage)
                    .toList();
            return ResponseEntity.badRequest().body(MessageReponse.builder()
                    .message(errorMessage.toString())
                    .status(HttpStatus.BAD_REQUEST.value())
                    .build());
        }
        PromotionResponse updatePromotion = promotionService.update(id, promotionDTO);
        return ResponseEntity.status(HttpStatus.OK).body(MessageReponse.builder()
                .message("Update Successfully")
                .status(HttpStatus.OK.value())
                .data(updatePromotion)
                .build());
    }
    //@PreAuthorize("hasAuthority('UPDATE_PROMOTION')")
    @PutMapping("/{id}/product-details")
    public ResponseEntity<?> updatePromotionProductDetails(
            @PathVariable("id") Integer id,
            @RequestBody PromotionDTO promotionDTO,  // Lấy thông tin từ body của request
            BindingResult result) throws Exception {

        // Kiểm tra lỗi validation
        if (result.hasErrors()) {
            List<String> errorMessage = result.getFieldErrors()
                    .stream()
                    .map(FieldError::getDefaultMessage)
                    .toList();
            return ResponseEntity.badRequest().body(MessageReponse.builder()
                    .message("Lỗi dữ liệu: " + errorMessage.toString())
                    .status(HttpStatus.BAD_REQUEST.value())
                    .build());
        }

        // Lấy giá trị applyPromotion từ PromotionDTO
        Boolean applyPromotion = promotionDTO.getApplyPromotion();
        System.out.println("Apply Promotion: " + applyPromotion);  // Kiểm tra xem giá trị có đúng không

        // Gọi phương thức cập nhật trong service với danh sách ID đã lấy và trạng thái áp dụng khuyến mãi
        PromotionResponse updatedPromotion = promotionService.updateProductDetails(id, promotionDTO.getProductDetailsIds(), applyPromotion);

        return ResponseEntity.status(HttpStatus.OK).body(MessageReponse.builder()
                .message("Cập nhật product details thành công")
                .status(HttpStatus.OK.value())
                .data(updatedPromotion)
                .build());
    }

   // @PreAuthorize("hasAuthority('UPDATE_PROMOTION')")
    @PutMapping("/{id}/status")
    public ResponseEntity<?> changeStatus(@PathVariable Integer id) {
        try {
            PromotionResponse promotionResponse = promotionService.changeStatus(id);
            return ResponseEntity.ok(promotionResponse);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }


    @GetMapping("detail/{id}")
    public ResponseEntity<?> getPromotionDetail(@PathVariable("id") Integer id) {
        try {
            // Gọi service để lấy thông tin khuyến mãi theo ID
            PromotionResponse promotion = PromotionResponse.fromPromotionResponse(promotionService.getPromotionById(id));

            return ResponseEntity.status(HttpStatus.OK).body(MessageReponse.builder()
                    .message("Lấy thông tin chi tiết thành công")
                    .status(HttpStatus.OK.value())
                    .data(promotion)
                    .build());
        } catch (Exception e) {
            // Nếu không tìm thấy khuyến mãi với ID, trả về lỗi
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(MessageReponse.builder()
                    .message("Không tìm thấy khuyến mãi với ID = " + id)
                    .status(HttpStatus.NOT_FOUND.value())
                    .build());
        }
    }
   // @PreAuthorize("hasAuthority('DELETE_PROMOTION')")
    @DeleteMapping("{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) throws Exception{
        promotionService.deletePromotion(id);
        return ResponseEntity.status(HttpStatus.OK).body(MessageReponse.builder()
                .message("Delete promotion with id = " + id + " successfully")
                .status(HttpStatus.OK.value())
                .build());
    }

}
