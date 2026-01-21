package com.brooks.pins;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.Instant;

public record PinCreateRequest(
    @NotBlank(message = "Pin text is required")
    @Size(min = 1, max = 500, message = "Pin text must be between 1 and 500 characters")
    String text,

    @Size(max = 2048, message = "Link URL must not exceed 2048 characters")
    String linkUrl,

    @NotNull(message = "Audience type is required")
    AudienceType audienceType,

    Instant availableFrom,

    @NotNull(message = "Expiration date is required")
    @Future(message = "Expiration date must be in the future")
    Instant expiresAt,

    @NotNull(message = "Reveal type is required")
    RevealType revealType,

    @Min(value = 1, message = "Reveal radius must be at least 1 meter")
    Integer revealRadiusM,

    MapPrecision mapPrecision,

    @Min(value = 1, message = "Notify radius must be at least 1 meter")
    Integer notifyRadiusM,

    @Min(value = 0, message = "Notify cooldown cannot be negative")
    Integer notifyCooldownSeconds,

    Boolean notifyRepeatable,
    Boolean futureSelf,

    @Valid
    PinAclRequest acl,

    @Valid
    @NotNull(message = "Location is required")
    LocationRequest location,

    @Valid
    PolygonRequest mysteryPolygon
) {}
