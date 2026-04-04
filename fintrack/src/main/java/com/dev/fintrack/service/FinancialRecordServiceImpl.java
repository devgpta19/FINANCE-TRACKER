package com.dev.fintrack.service;

import com.dev.fintrack.dto.record.FinancialRecordRequest;
import com.dev.fintrack.dto.record.FinancialRecordResponse;
import com.dev.fintrack.entity.Category;
import com.dev.fintrack.entity.FinancialRecord;
import com.dev.fintrack.entity.User;
import com.dev.fintrack.enums.RecordType;
import com.dev.fintrack.exception.ResourceNotFoundException;
import com.dev.fintrack.exception.UnauthorizedException;
import com.dev.fintrack.repository.CategoryRepository;
import com.dev.fintrack.repository.FinancialRecordRepository;
import com.dev.fintrack.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FinancialRecordServiceImpl implements FinancialRecordService {

    @Autowired
    private FinancialRecordRepository recordRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private UserRepository userRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @Override
    public FinancialRecordResponse createRecord(FinancialRecordRequest request) {

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        User user = getCurrentUser();

        FinancialRecord record = new FinancialRecord();
        record.setAmount(request.getAmount());
        record.setType(request.getType());
        record.setCategory(category);
        record.setDate(request.getDate());
        record.setDescription(request.getDescription());
        record.setCreatedBy(user);

        recordRepository.save(record);

        return mapToResponse(record);
    }

    @Override
    public List<FinancialRecordResponse> getAllRecords() {
        return recordRepository.findByCreatedBy(getCurrentUser())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public FinancialRecordResponse getRecordById(Long id) {
        FinancialRecord record = recordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Record not found"));
        
        if (!record.getCreatedBy().getId().equals(getCurrentUser().getId())) {
             throw new UnauthorizedException("You do not have access to this record");
        }

        return mapToResponse(record);
    }

    @Override
    public FinancialRecordResponse updateRecord(Long id, FinancialRecordRequest request) {
        FinancialRecord record = recordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Record not found"));

        if (!record.getCreatedBy().getId().equals(getCurrentUser().getId())) {
             throw new UnauthorizedException("You do not have access to this record");
        }

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        record.setAmount(request.getAmount());
        record.setType(request.getType());
        record.setCategory(category);
        record.setDate(request.getDate());
        record.setDescription(request.getDescription());

        recordRepository.save(record);

        return mapToResponse(record);
    }

    @Override
    public void deleteRecord(Long id) {
        FinancialRecord record = recordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Record not found"));

        if (!record.getCreatedBy().getId().equals(getCurrentUser().getId())) {
             throw new UnauthorizedException("You do not have access to this record");
        }

        recordRepository.delete(record);
    }

    @Override
    public List<FinancialRecordResponse> filterRecords(String type, Long categoryId,
                                                       LocalDate startDate, LocalDate endDate) {

        List<FinancialRecord> records;
        User user = getCurrentUser();

        if (type != null && startDate != null && endDate != null) {
            records = recordRepository.findByCreatedByAndTypeAndDateBetween(
                    user, RecordType.valueOf(type), startDate, endDate);
        } else if (type != null) {
            records = recordRepository.findByCreatedByAndType(user, RecordType.valueOf(type));
        } else if (categoryId != null) {
            records = recordRepository.findByCreatedByAndCategoryId(user, categoryId);
        } else if (startDate != null && endDate != null) {
            records = recordRepository.findByCreatedByAndDateBetween(user, startDate, endDate);
        } else {
            records = recordRepository.findByCreatedBy(user);
        }

        return records.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private FinancialRecordResponse mapToResponse(FinancialRecord record) {
        return new FinancialRecordResponse(
                record.getId(),
                record.getAmount(),
                record.getType(),
                record.getCategory().getName(),
                record.getDate(),
                record.getDescription(),
                record.getCreatedBy().getName(),
                record.getCreatedAt()
        );
    }
}