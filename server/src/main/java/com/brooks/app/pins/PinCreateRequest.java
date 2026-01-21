package com.brooks.app.pins;

import com.brooks.app.common.model.AudienceType;
import com.brooks.app.common.model.MapPrecision;
import com.brooks.app.common.model.RevealType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;

public record PinCreateRequest(
    @NotBlank String text,
    String linkUrl,
    @NotNull AudienceType audienceType,
    Instant availableFrom,
    @NotNull Instant expiresAt,
    @NotNull RevealType revealType,
    Integer revealRadiusM,
    MapPrecision mapPrecision,
    Integer notifyRadiusM,
    Integer notifyCooldownSeconds,
    Boolean notifyRepeatable,
    PinAclRequest acl,
    @Valid @NotNull LocationRequest location,
    PolygonRequest mysteryPolygon
) {}
