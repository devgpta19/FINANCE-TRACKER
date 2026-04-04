package com.dev.fintrack.controller;

import com.dev.fintrack.dto.record.FinancialRecordRequest;
import com.dev.fintrack.dto.record.FinancialRecordResponse;
import com.dev.fintrack.service.FinancialRecordService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/records")
public class FinancialRecordController {

    @Autowired
    private FinancialRecordService recordService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<FinancialRecordResponse> createRecord(@Valid @RequestBody FinancialRecordRequest request) {
        return ResponseEntity.ok(recordService.createRecord(request));
    }

    @PreAuthorize("hasAnyRole('ADMIN','VIEWER')")
    @GetMapping
    public ResponseEntity<List<FinancialRecordResponse>> getRecords(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate) {

        return ResponseEntity.ok(recordService.filterRecords(type, categoryId, startDate, endDate));
    }
    
    @PreAuthorize("hasAnyRole('ADMIN','VIEWER')")
    @GetMapping("/{id}")
    public ResponseEntity<FinancialRecordResponse> getRecord(@PathVariable Long id) {
        return ResponseEntity.ok(recordService.getRecordById(id));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<FinancialRecordResponse> updateRecord(@PathVariable Long id,
                                                                @Valid @RequestBody FinancialRecordRequest request) {
        return ResponseEntity.ok(recordService.updateRecord(id, request));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteRecord(@PathVariable Long id) {
        recordService.deleteRecord(id);
        return ResponseEntity.ok("Record deleted successfully");
    }
}