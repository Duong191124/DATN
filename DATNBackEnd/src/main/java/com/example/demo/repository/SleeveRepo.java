package com.example.demo.repository;

import com.example.demo.entity.Sleeve;
import org.springframework.data.jpa.repository.JpaRepository;
<<<<<<< HEAD

public interface SleeveRepo extends JpaRepository<Sleeve, Integer> {
=======
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SleeveRepo extends JpaRepository<Sleeve,Integer> {
    Optional<Sleeve> findByName(String name);
>>>>>>> 2737feb9f6b602c7b2f4ffe0782eb9372e6c60e0
}
