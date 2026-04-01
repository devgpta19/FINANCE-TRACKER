package com.dev.fintrack.service;

import com.dev.fintrack.dto.dashboard.CategorySummaryResponse;
import com.dev.fintrack.dto.dashboard.DashboardSummaryResponse;
import com.dev.fintrack.dto.dashboard.MonthlyTrendResponse;

import java.util.List;

public interface DashboardService {

    DashboardSummaryResponse getDashboardSummary();

    List<CategorySummaryResponse> getCategorySummary();

    List<MonthlyTrendResponse> getMonthlyTrends();
}