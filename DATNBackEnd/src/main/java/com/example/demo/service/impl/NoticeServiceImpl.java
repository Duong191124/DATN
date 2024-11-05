package com.example.demo.service.impl;

import com.example.demo.entity.Notice;
import com.example.demo.repository.NoticeRepo;
import com.example.demo.service.NoticeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class NoticeImpl implements NoticeService {
    @Autowired
    NoticeRepo noticeRepo;
    @Override
    public Page<Notice> getAll(Pageable pageable) {
        return noticeRepo.findAll(pageable);
    }

    @Override
    public Notice create(Notice notice) {
        notice.sendNotice();
        return noticeRepo.save(notice);
    }
}
