package com.dev.fintrack.repository;

import com.dev.fintrack.entity.FinancialRecord;
import com.dev.fintrack.entity.User;
import com.dev.fintrack.enums.RecordType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface FinancialRecordRepository extends JpaRepository<FinancialRecord, Long> {

    List<FinancialRecord> findByCreatedBy(User user);

    List<FinancialRecord> findByCreatedByAndType(User user, RecordType type);

    List<FinancialRecord> findByCreatedByAndDateBetween(User user, LocalDate startDate, LocalDate endDate);

    List<FinancialRecord> findByCreatedByAndCategoryId(User user, Long categoryId);

    List<FinancialRecord> findByCreatedByAndTypeAndDateBetween(User user, RecordType type, LocalDate startDate, LocalDate endDate);
}