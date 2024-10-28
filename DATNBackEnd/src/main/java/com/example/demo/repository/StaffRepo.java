package com.example.demo.repository;

import com.example.demo.entity.Staff;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StaffRepo extends JpaRepository<Staff, Integer> {

    @Query("SELECT s FROM Staff s WHERE " +
            "(:username IS NULL OR s.username LIKE %:username%) AND " +
            "(:phoneNumber IS NULL OR s.phoneNumber LIKE %:phoneNumber%)")
    Page<Staff> findByUsernameAndPhoneNumber(@Param("username") String username,
                                             @Param("phoneNumber") String phoneNumber,
                                             Pageable pageable);

    public boolean existsByUsername(String usename);

    public Staff findByUsername(String username);
}
