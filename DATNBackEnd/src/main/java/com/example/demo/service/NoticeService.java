package com.example.demo.service;

import com.example.demo.entity.Notice;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface NoticeService {
    Page<Notice> getAll(Pageable pageable);
    Notice create(Notice notice);
}
