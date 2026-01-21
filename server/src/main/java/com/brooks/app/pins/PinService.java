package com.brooks.app.pins;

import java.util.Collections;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class PinService {
  public PinResponse create(PinCreateRequest request) {
    return new PinResponse(UUID.randomUUID().toString(), "CREATED");
  }

  public MapPinsResponse mapPins(String bbox) {
    return new MapPinsResponse(Collections.emptyList());
  }

  public PinCandidatesResponse candidates(String bucket) {
    return new PinCandidatesResponse(Collections.emptyList());
  }

  public RevealCheckResponse checkReveal(UUID pinId, RevealCheckRequest request) {
    return new RevealCheckResponse(false, null);
  }

  public void delete(UUID pinId) {
  }
}
