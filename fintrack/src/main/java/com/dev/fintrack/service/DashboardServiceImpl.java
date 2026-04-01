package com.dev.fintrack.service;

import com.dev.fintrack.dto.dashboard.CategorySummaryResponse;
import com.dev.fintrack.dto.dashboard.DashboardSummaryResponse;
import com.dev.fintrack.dto.dashboard.MonthlyTrendResponse;
import com.dev.fintrack.entity.FinancialRecord;
import com.dev.fintrack.enums.RecordType;
import com.dev.fintrack.repository.FinancialRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.YearMonth;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardServiceImpl implements DashboardService {

    @Autowired
    private FinancialRecordRepository recordRepository;

    @Override
    public DashboardSummaryResponse getDashboardSummary() {
        List<FinancialRecord> records = recordRepository.findAll();

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
        List<FinancialRecord> records = recordRepository.findAll();

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
        List<FinancialRecord> records = recordRepository.findAll();

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