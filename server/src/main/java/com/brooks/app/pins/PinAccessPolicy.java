package com.brooks.app.pins;

import com.brooks.app.common.model.RevealType;

public class PinAccessPolicy {
  public PolicyDecision evaluate(PolicyInput input) {
    if (!input.timeEligible()) {
      return PolicyDecision.deny("TIME_WINDOW");
    }
    if (input.isBlocked()) {
      return PolicyDecision.deny("BLOCKED");
    }
    if (!input.allowedByAudience()) {
      return PolicyDecision.deny("AUDIENCE");
    }
    if (!input.inRequiredLists()) {
      return PolicyDecision.deny("LISTS");
    }
    if (!input.canSeePins()) {
      return PolicyDecision.deny("REL_PREF");
    }
    if (input.forNotification() && !input.canReceiveNotifications()) {
      return PolicyDecision.deny("NOTIFY_PREF");
    }
    if (input.revealType() == RevealType.REACH_TO_REVEAL && !input.inRevealRadius()) {
      return PolicyDecision.deny("DISTANCE");
    }
    if (input.futureSelfMode() && !input.inRevealRadius()) {
      return PolicyDecision.deny("FUTURE_SELF");
    }
    return PolicyDecision.allow();
  }

  public record PolicyInput(
      boolean timeEligible,
      boolean isBlocked,
      boolean allowedByAudience,
      boolean inRequiredLists,
      boolean canSeePins,
      boolean forNotification,
      boolean canReceiveNotifications,
      RevealType revealType,
      boolean inRevealRadius,
      boolean futureSelfMode
  ) {}

  public record PolicyDecision(boolean allowed, String reason) {
    public static PolicyDecision allow() {
      return new PolicyDecision(true, "OK");
    }

    public static PolicyDecision deny(String reason) {
      return new PolicyDecision(false, reason);
    }
  }
}
