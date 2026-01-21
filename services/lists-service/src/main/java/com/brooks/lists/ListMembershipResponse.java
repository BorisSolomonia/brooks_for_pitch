package com.brooks.lists;

import java.util.List;

public record ListMembershipResponse(
    boolean inAny,
    List<String> memberOfListIds
) {}
