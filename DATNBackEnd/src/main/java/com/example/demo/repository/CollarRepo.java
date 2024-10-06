package com.example.demo.repository;

import com.example.demo.entity.Collar;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CollarRepo extends JpaRepository<Collar,Integer> {
    Optional<Collar> findByName(String name);
}
