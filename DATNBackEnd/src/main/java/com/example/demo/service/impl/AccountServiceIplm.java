package com.example.demo.service.impl;

import com.example.demo.dto.AccountDTO;
import com.example.demo.entity.Account;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AccountServiceIplm {
    Page<Account> getAll(int page, int size);

    Account save(AccountDTO accountDTO);

    void deleteById(int id);

    Account getById(int id);

}
