package com.dev.fintrack.controller;

import com.dev.fintrack.dto.dashboard.CategorySummaryResponse;
import com.dev.fintrack.dto.dashboard.DashboardSummaryResponse;
import com.dev.fintrack.dto.dashboard.MonthlyTrendResponse;
import com.dev.fintrack.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

//    @PreAuthorize("hasAnyRole('ADMIN','VIEWER')")
    @GetMapping("/summary")
    public ResponseEntity<DashboardSummaryResponse> getSummary() {
        return ResponseEntity.ok(dashboardService.getDashboardSummary());
    }

    @PreAuthorize("hasAnyRole('ADMIN','VIEWER')")
    @GetMapping("/category-summary")
    public ResponseEntity<List<CategorySummaryResponse>> getCategorySummary() {
        return ResponseEntity.ok(dashboardService.getCategorySummary());
    }

    @PreAuthorize("hasAnyRole('ADMIN','VIEWER')")
    @GetMapping("/monthly-trends")
    public ResponseEntity<List<MonthlyTrendResponse>> getMonthlyTrends() {
        return ResponseEntity.ok(dashboardService.getMonthlyTrends());
    }
}