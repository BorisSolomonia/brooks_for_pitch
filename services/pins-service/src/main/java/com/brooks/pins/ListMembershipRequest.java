package com.brooks.pins;

import java.util.List;

public record ListMembershipRequest(
    String userId,
    List<String> listIds
) {}
