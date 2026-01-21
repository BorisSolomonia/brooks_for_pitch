package com.brooks.pins;

import java.util.List;

public record ListMembershipResponse(
    boolean inAny,
    List<String> memberOfListIds
) {}
