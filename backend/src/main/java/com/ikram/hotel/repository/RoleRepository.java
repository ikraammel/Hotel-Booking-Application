package com.ikram.hotel.repository;

import com.ikram.hotel.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role,Long> {
    Optional<Role> findByName(String name);

    boolean existsByName(String name);
}
