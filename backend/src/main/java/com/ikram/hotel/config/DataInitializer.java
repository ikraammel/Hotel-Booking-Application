package com.ikram.hotel.config;

import com.ikram.hotel.model.Role;
import com.ikram.hotel.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;

    @Override
    public void run(String... args) {
        initializeRoles();
    }

    private void initializeRoles() {
        List<String> defaultRoles = Arrays.asList("ROLE_USER", "ROLE_ADMIN");

        for (String roleName : defaultRoles) {
            if (!roleRepository.existsByName(roleName)) {
                Role role = new Role(roleName);
                roleRepository.save(role);
                log.info("Created default role: {}", roleName);
            } else {
                log.info("Role already exists: {}", roleName);
            }
        }
    }
}
