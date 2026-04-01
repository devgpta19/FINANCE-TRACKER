package com.dev.fintrack.dto.record;

import com.dev.fintrack.enums.RecordType;

import java.math.BigDecimal;
import java.time.LocalDate;

public class FinancialRecordRequest {

    private BigDecimal amount;
    private RecordType type;
    private Long categoryId;
    private LocalDate date;
    private String description;

    public FinancialRecordRequest() {
    }

    public FinancialRecordRequest(BigDecimal amount, RecordType type, Long categoryId, LocalDate date, String description) {
        this.amount = amount;
        this.type = type;
        this.categoryId = categoryId;
        this.date = date;
        this.description = description;
    }

    public BigDecimal getAmount() {
        return amount;
    }
    
    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public RecordType getType() {
        return type;
    }

    public void setType(RecordType type) {
        this.type = type;
    }

    public Long getCategoryId() {
        return categoryId;
    }
    
    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
}