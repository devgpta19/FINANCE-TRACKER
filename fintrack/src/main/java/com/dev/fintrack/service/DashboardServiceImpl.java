package com.dev.fintrack.service;

import com.dev.fintrack.dto.dashboard.CategorySummaryResponse;
import com.dev.fintrack.dto.dashboard.DashboardSummaryResponse;
import com.dev.fintrack.dto.dashboard.MonthlyTrendResponse;
import com.dev.fintrack.entity.FinancialRecord;
import com.dev.fintrack.entity.User;
import com.dev.fintrack.enums.RecordType;
import com.dev.fintrack.exception.ResourceNotFoundException;
import com.dev.fintrack.repository.FinancialRecordRepository;
import com.dev.fintrack.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.YearMonth;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardServiceImpl implements DashboardService {

    @Autowired
    private FinancialRecordRepository recordRepository;

    @Autowired
    private UserRepository userRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @Override
    public DashboardSummaryResponse getDashboardSummary() {
        List<FinancialRecord> records = recordRepository.findByCreatedBy(getCurrentUser());

        BigDecimal totalIncome = records.stream()
                .filter(record -> record.getType() == RecordType.INCOME)
                .map(FinancialRecord::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalExpense = records.stream()
                .filter(record -> record.getType() == RecordType.EXPENSE)
                .map(FinancialRecord::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal netBalance = totalIncome.subtract(totalExpense);

        return new DashboardSummaryResponse(totalIncome, totalExpense, netBalance);
    }

    @Override
    public List<CategorySummaryResponse> getCategorySummary() {
        List<FinancialRecord> records = recordRepository.findByCreatedBy(getCurrentUser());

        Map<String, BigDecimal> categoryTotals = records.stream()
                .filter(record -> record.getType() == RecordType.EXPENSE)
                .collect(Collectors.groupingBy(
                        record -> record.getCategory().getName(),
                        Collectors.reducing(
                                BigDecimal.ZERO,
                                FinancialRecord::getAmount,
                                BigDecimal::add
                        )
                ));

        return categoryTotals.entrySet().stream()
                .map(entry -> new CategorySummaryResponse(entry.getKey(), entry.getValue()))
                .sorted((a, b) -> b.getTotal().compareTo(a.getTotal()))
                .collect(Collectors.toList());
    }

    @Override
    public List<MonthlyTrendResponse> getMonthlyTrends() {
        List<FinancialRecord> records = recordRepository.findByCreatedBy(getCurrentUser());

        Map<YearMonth, List<FinancialRecord>> groupedByMonth = records.stream()
                .collect(Collectors.groupingBy(record -> YearMonth.from(record.getDate())));

        List<MonthlyTrendResponse> trends = new ArrayList<>();

        for (Map.Entry<YearMonth, List<FinancialRecord>> entry : groupedByMonth.entrySet()) {
            YearMonth month = entry.getKey();
            List<FinancialRecord> monthlyRecords = entry.getValue();

            BigDecimal income = monthlyRecords.stream()
                    .filter(record -> record.getType() == RecordType.INCOME)
                    .map(FinancialRecord::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            BigDecimal expense = monthlyRecords.stream()
                    .filter(record -> record.getType() == RecordType.EXPENSE)
                    .map(FinancialRecord::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            trends.add(new MonthlyTrendResponse(month.toString(), income, expense));
        }

        trends.sort(Comparator.comparing(MonthlyTrendResponse::getMonth));

        return trends;
    }
}