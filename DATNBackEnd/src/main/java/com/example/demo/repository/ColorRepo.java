package com.example.demo.repository;

import com.example.demo.entity.Color;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ColorRepo extends JpaRepository<Color, Integer> {
    Optional<Color> findByName(String name);
    Optional<Color> findByCode(String code);

}
