package com.brooks.lists;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import java.util.List;

public record ListMembersRequest(
    @NotEmpty(message = "Member IDs list cannot be empty")
    @Size(max = 100, message = "Cannot add more than 100 members at once")
    List<String> memberIds
) {}
