package com.dev.fintrack.service;

import com.dev.fintrack.dto.record.FinancialRecordRequest;
import com.dev.fintrack.dto.record.FinancialRecordResponse;

import java.time.LocalDate;
import java.util.List;

public interface FinancialRecordService {

    FinancialRecordResponse createRecord(FinancialRecordRequest request);

    List<FinancialRecordResponse> getAllRecords();

    FinancialRecordResponse getRecordById(Long id);

    FinancialRecordResponse updateRecord(Long id, FinancialRecordRequest request);

    void deleteRecord(Long id);

    List<FinancialRecordResponse> filterRecords(String type, Long categoryId,
                                                LocalDate startDate, LocalDate endDate);
}