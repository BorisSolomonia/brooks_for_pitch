package com.brooks.app.pins;

import java.util.List;

public record PinAclRequest(
    List<String> listIds,
    List<String> userIds
) {}
