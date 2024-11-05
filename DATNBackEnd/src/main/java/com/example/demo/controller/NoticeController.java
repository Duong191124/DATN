package com.example.demo.controller;

import com.example.demo.entity.Customer;
import com.example.demo.entity.Notice;
import com.example.demo.response.MessageReponse;
import com.example.demo.service.impl.NoticeServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("${api.prefix}/notice")
@RequiredArgsConstructor
public class NoticeController {
    private final NoticeServiceImpl noticeService;
    @GetMapping("/getAll")
    public ResponseEntity<MessageReponse> getAll(
            @RequestParam(name = "page", defaultValue = "1") int page,
            @RequestParam(name = "size", defaultValue = "10") int size
    ) {
        // Tạo Pageable với sắp xếp theo created_at giảm dần
        Pageable pageable = PageRequest.of(page - 1, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Notice> notices = noticeService.getAll(pageable);
        return ResponseEntity.ok().body(MessageReponse.builder()
                .message("get info successfully")
                .status(HttpStatus.OK.value())
                .data(notices)
                .build()
        );
    }

}
