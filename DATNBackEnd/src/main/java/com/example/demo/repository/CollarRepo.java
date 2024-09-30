package com.example.demo.repository;

import com.example.demo.entity.Collar;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CollarRepo extends JpaRepository<Collar, Integer> {
}
