package com.dev.fintrack.config;

import com.dev.fintrack.entity.Role;
import com.dev.fintrack.enums.RoleName;
import com.dev.fintrack.repository.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initRoles(RoleRepository roleRepository) {
        return args -> {
            if (roleRepository.findByName(RoleName.ADMIN).isEmpty()) {
                Role adminRole = new Role();
                adminRole.setName(RoleName.ADMIN);
                roleRepository.save(adminRole);
            }

            if (roleRepository.findByName(RoleName.ANALYST).isEmpty()) {
                Role analystRole = new Role();
                analystRole.setName(RoleName.ANALYST);
                roleRepository.save(analystRole);
            }

            if (roleRepository.findByName(RoleName.VIEWER).isEmpty()) {
                Role viewerRole = new Role();
                viewerRole.setName(RoleName.VIEWER);
                roleRepository.save(viewerRole);
            }
        };
    }
}