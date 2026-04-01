package com.dev.fintrack.dto.dashboard;

import java.math.BigDecimal;

public class CategorySummaryResponse {

    private String category;
    private BigDecimal total;

    public CategorySummaryResponse() {
    }

    public CategorySummaryResponse(String category, BigDecimal total) {
        this.category = category;
        this.total = total;
    }

    public String getCategory() {
        return category;
    }
    
    public void setCategory(String category) {
        this.category = category;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }
}