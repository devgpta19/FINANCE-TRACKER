package com.dev.fintrack.dto.category;

import com.dev.fintrack.enums.RecordType;

public class CategoryRequest {

    private String name;
    private RecordType type;

    public CategoryRequest() {
    }

    public CategoryRequest(String name, RecordType type) {
        this.name = name;
        this.type = type;
    }

    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }

    public RecordType getType() {
        return type;
    }

    public void setType(RecordType type) {
        this.type = type;
    }
}