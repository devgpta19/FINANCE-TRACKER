package com.dev.fintrack.config;

import com.dev.fintrack.entity.Role;
import com.dev.fintrack.enums.RoleName;
import com.dev.fintrack.repository.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initRoles(RoleRepository roleRepository, JdbcTemplate jdbcTemplate) {
        return args -> {
            // Clean up obsolete ANALYST data directly from DB to prevent enum mapping crashes
            try {
                jdbcTemplate.execute("DELETE FROM users WHERE role_id = (SELECT id FROM roles WHERE name = 'ANALYST')");
                jdbcTemplate.execute("DELETE FROM roles WHERE name = 'ANALYST'");
            } catch (Exception e) {
                // Ignore if tables don't exist yet
            }

            if (roleRepository.findByName(RoleName.ADMIN).isEmpty()) {
                Role adminRole = new Role();
                adminRole.setName(RoleName.ADMIN);
                roleRepository.save(adminRole);
            }

            if (roleRepository.findByName(RoleName.VIEWER).isEmpty()) {
                Role viewerRole = new Role();
                viewerRole.setName(RoleName.VIEWER);
                roleRepository.save(viewerRole);
            }
        };
    }
}