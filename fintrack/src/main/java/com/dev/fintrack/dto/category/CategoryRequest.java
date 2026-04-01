package com.dev.fintrack.dto.category;

import com.dev.fintrack.enums.RecordType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CategoryRequest {

	@NotBlank(message = "Category name is required")
	private String name;

	@NotNull(message = "Category type is required")
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