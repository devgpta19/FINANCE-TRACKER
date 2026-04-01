package com.dev.fintrack.repository;

import com.dev.fintrack.entity.Category;
import com.dev.fintrack.enums.RecordType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    List<Category> findByType(RecordType type);

    boolean existsByName(String name);
}