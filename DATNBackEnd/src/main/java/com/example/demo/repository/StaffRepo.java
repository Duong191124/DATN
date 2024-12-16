package com.example.demo.repository;

import com.example.demo.entity.Staff;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StaffRepo extends JpaRepository<Staff, Integer> {

    @Query("SELECT s FROM Staff s WHERE " +
            "(:username IS NULL OR s.username LIKE %:username%) AND " +
            "(:phoneNumber IS NULL OR s.phoneNumber LIKE %:phoneNumber%)")
    Page<Staff> findByUsernameAndPhoneNumber(@Param("username") String username,
                                             @Param("phoneNumber") String phoneNumber,
                                             Pageable pageable);

    public boolean existsByUsername(String usename);
    public boolean existsByEmail(String email);
    public Staff findByUsername(String username);
    public Staff findByEmail(String email);

    @Query(value = "SELECT " +
            "SUM(CASE WHEN permissionCount = (SELECT COUNT(*) FROM permission) THEN 1 ELSE 0 END) AS adminCount, " +
            "SUM(CASE WHEN permissionCount >= 20 AND permissionCount < 35 THEN 1 ELSE 0 END) AS managerCount, " +
            "SUM(CASE WHEN permissionCount < 20 THEN 1 ELSE 0 END) AS normalEmployeeCount " +
            "FROM ( " +
            "  SELECT s.id, COUNT(sp.permission_id) AS permissionCount " +
            "  FROM staff s " +
            "  LEFT JOIN staff_permission sp ON s.id = sp.staff_id " +
            "  GROUP BY s.id " +
            ") AS staff_permissions",
            nativeQuery = true)
    List<Object[]> getStaffStatistics();
}
