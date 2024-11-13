package com.example.demo.repository;

import com.example.demo.entity.Weight;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WeightRepo extends JpaRepository< Weight,Integer> {
}
