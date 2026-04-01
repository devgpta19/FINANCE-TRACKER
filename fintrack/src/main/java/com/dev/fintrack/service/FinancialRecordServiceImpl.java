package com.dev.fintrack.service;

import com.dev.fintrack.dto.record.FinancialRecordRequest;
import com.dev.fintrack.dto.record.FinancialRecordResponse;
import com.dev.fintrack.entity.Category;
import com.dev.fintrack.entity.FinancialRecord;
import com.dev.fintrack.entity.User;
import com.dev.fintrack.enums.RecordType;
import com.dev.fintrack.exception.ResourceNotFoundException;
import com.dev.fintrack.repository.CategoryRepository;
import com.dev.fintrack.repository.FinancialRecordRepository;
import com.dev.fintrack.repository.UserRepository;
import com.dev.fintrack.service.FinancialRecordService;
import org.springframework.beans.factory.annotation.Autowired;
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

    @Override
    public FinancialRecordResponse createRecord(FinancialRecordRequest request) {

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        // For now assign Admin user (id = 1)
        User user = userRepository.findById(1L)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

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
        return recordRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public FinancialRecordResponse getRecordById(Long id) {
        FinancialRecord record = recordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Record not found"));
        return mapToResponse(record);
    }

    @Override
    public FinancialRecordResponse updateRecord(Long id, FinancialRecordRequest request) {
        FinancialRecord record = recordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Record not found"));

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

        recordRepository.delete(record);
    }

    @Override
    public List<FinancialRecordResponse> filterRecords(String type, Long categoryId,
                                                       LocalDate startDate, LocalDate endDate) {

        List<FinancialRecord> records;

        if (type != null && startDate != null && endDate != null) {
            records = recordRepository.findByTypeAndDateBetween(
                    RecordType.valueOf(type), startDate, endDate);
        } else if (type != null) {
            records = recordRepository.findByType(RecordType.valueOf(type));
        } else if (categoryId != null) {
            records = recordRepository.findByCategoryId(categoryId);
        } else if (startDate != null && endDate != null) {
            records = recordRepository.findByDateBetween(startDate, endDate);
        } else {
            records = recordRepository.findAll();
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