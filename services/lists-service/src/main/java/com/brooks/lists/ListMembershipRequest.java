package com.brooks.lists;

import java.util.List;

public record ListMembershipRequest(
    String userId,
    List<String> listIds
) {}
