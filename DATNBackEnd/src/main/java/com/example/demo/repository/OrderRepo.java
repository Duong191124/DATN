package com.example.demo.repository;

import com.example.demo.entity.OrderStatus;
import com.example.demo.entity.Orders;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface OrderRepo extends JpaRepository<Orders, Integer> {
    @Query("SELECT o FROM Orders o " +
            "LEFT JOIN o.staff s " +
            "WHERE (:staffName IS NULL OR :staffName = '' OR LOWER(s.name) LIKE LOWER(CONCAT('%', :staffName, '%'))) " +
            "AND (:startDate IS NULL OR o.orderDate >= :startDate) " +
            "AND (:endDate IS NULL OR o.orderDate <= :endDate) " +
            "AND (:orderStatus IS NULL OR o.status = :orderStatus) " +
            "AND (:orderCode IS NULL OR LOWER(o.code) LIKE LOWER(CONCAT('%', :orderCode, '%'))" +
            ")"
    )
    Page<Orders> pageAll(@Param("staffName") String staffName,
                         @Param("startDate") LocalDate startDate,
                         @Param("endDate") LocalDate  endDate,
                         @Param("orderStatus") OrderStatus orderStatus,
                         @Param("orderCode") String orderCode,
                         Pageable pageable);

    @Query("SELECT o FROM Orders o " +
            "LEFT JOIN o.customer s " +
            "WHERE (:orderStatus IS NULL OR o.status = :orderStatus) " +
            "AND (:customerId IS NULL OR s.id = :customerId)"
    )
    Page<Orders> pageAllByStatus(@Param("orderStatus") OrderStatus orderStatus,
                                 @Param("customerId") Integer customerId,
                                 Pageable pageable
    );

    @Query("SELECT o FROM Orders o WHERE o.status = 'PENDING' AND o.staff.id = :staffId")
    List<Orders> findPendingOrdersByStaffId(@Param("staffId") Integer staffId);

    Orders findByCode(String code);
    List<Orders> findByCustomerId(int customerId);
    Long countByCustomerIdAndVoucherId(int customerId, int voucherId);

    @Query(value = "SELECT " +
            "DATE_FORMAT(o.order_date, '%Y-%m-%d') AS day, " +  // Ngày theo định dạng YYYY-MM-DD
            "DATE_FORMAT(o.order_date, '%Y-%m') AS month, " +  // Tháng theo định dạng YYYY-MM
            "YEAR(o.order_date) AS year, " +  // Năm
            "SUM(CASE WHEN o.staff_id IS NULL THEN od.quantity ELSE 0 END) AS online_quantity, " +  // Số lượng bán online
            "SUM(CASE WHEN o.staff_id IS NOT NULL THEN od.quantity ELSE 0 END) AS offline_quantity, " +  // Số lượng bán offline
            "SUM(CASE WHEN o.staff_id IS NULL THEN od.price * od.quantity ELSE 0 END) AS online_revenue, " +  // Doanh thu online
            "SUM(CASE WHEN o.staff_id IS NOT NULL THEN od.price * od.quantity ELSE 0 END) AS offline_revenue " +  // Doanh thu offline
            "FROM orders o " +
            "JOIN order_detail od ON o.id = od.order_id " +
            "WHERE o.status = 'shipped' " +  // Trạng thái là 'shipped'
            "GROUP BY day, month, year " +  // Nhóm theo ngày, tháng, năm
            "ORDER BY day, month, year", nativeQuery = true)
    List<Object[]> getMonthProductsStatistics();

}
