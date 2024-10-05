package com.example.demo.repository;

import com.example.demo.entity.Collar;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

<<<<<<< HEAD
@Repository
public interface CollarRepo extends JpaRepository<Collar, Integer> {
=======
import java.util.Optional;

@Repository
public interface CollarRepo extends JpaRepository<Collar,Integer> {
    Optional<Collar> findByName(String name);
>>>>>>> 2737feb9f6b602c7b2f4ffe0782eb9372e6c60e0
}
