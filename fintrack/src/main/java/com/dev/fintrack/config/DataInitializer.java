package com.dev.fintrack.config;

import com.dev.fintrack.entity.Role;
import com.dev.fintrack.entity.Category;
import com.dev.fintrack.enums.RoleName;
import com.dev.fintrack.enums.RecordType;
import com.dev.fintrack.repository.RoleRepository;
import com.dev.fintrack.repository.CategoryRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(RoleRepository roleRepository, CategoryRepository categoryRepository) {
        return args -> {
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

            // Seed global categories if empty
            if (categoryRepository.count() == 0) {
                categoryRepository.save(new Category(null, "Salary", RecordType.INCOME));
                categoryRepository.save(new Category(null, "Investment", RecordType.INCOME));
                categoryRepository.save(new Category(null, "Freelance", RecordType.INCOME));
                
                categoryRepository.save(new Category(null, "Food & Dining", RecordType.EXPENSE));
                categoryRepository.save(new Category(null, "Housing & Rent", RecordType.EXPENSE));
                categoryRepository.save(new Category(null, "Transportation", RecordType.EXPENSE));
                categoryRepository.save(new Category(null, "Utilities", RecordType.EXPENSE));
                categoryRepository.save(new Category(null, "Entertainment", RecordType.EXPENSE));
                categoryRepository.save(new Category(null, "Health & Medical", RecordType.EXPENSE));
            }
        };
    }
}