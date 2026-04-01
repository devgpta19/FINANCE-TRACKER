package com.dev.fintrack.repository;

import com.dev.fintrack.entity.FinancialRecord;
import com.dev.fintrack.enums.RecordType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface FinancialRecordRepository extends JpaRepository<FinancialRecord, Long> {

    List<FinancialRecord> findByType(RecordType type);

    List<FinancialRecord> findByDateBetween(LocalDate startDate, LocalDate endDate);

    List<FinancialRecord> findByCategoryId(Long categoryId);

    List<FinancialRecord> findByTypeAndDateBetween(RecordType type, LocalDate startDate, LocalDate endDate);
}