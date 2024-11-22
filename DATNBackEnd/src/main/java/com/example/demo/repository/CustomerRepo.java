package com.example.demo.repository;

import com.example.demo.entity.Customer;
import com.example.demo.response.CustomerBuyInTheMostResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomerRepo extends JpaRepository<Customer, Integer> {
    public boolean existsByUsername(String usename);
    public boolean existsByEmail(String email);

    public Customer findByUsername(String username);

    public Customer findByEmail(String email);

    @Query("SELECT count(c) FROM Customer c")
    Long countCustomer();

    @Query("SELECT new com.example.demo.response.CustomerBuyInTheMostResponse(c.name, c.phoneNumber, SUM(od.quantity)) " +
            "FROM Customer c " +
            "JOIN Orders o on o.customer.id = c.id " +
            "JOIN OrderDetail od on od.orders.id = o.id " +
            "WHERE c.name <> 'khách lẻ' " +
            "GROUP BY c.name, c.phoneNumber " +
            "ORDER BY SUM(od.quantity) DESC")
    List<CustomerBuyInTheMostResponse> findTopCustomersByTotalProductsBought();
}
