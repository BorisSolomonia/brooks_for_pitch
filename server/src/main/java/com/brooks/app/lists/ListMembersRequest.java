package com.brooks.app.lists;

import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public record ListMembersRequest(
    @NotEmpty List<String> memberIds
) {}
