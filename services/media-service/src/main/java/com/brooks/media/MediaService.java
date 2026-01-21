package com.brooks.media;

import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class MediaService {
  private final String uploadBaseUrl;

  public MediaService(@Value("${brooks.media.upload-base-url}") String uploadBaseUrl) {
    this.uploadBaseUrl = uploadBaseUrl;
  }

  public MediaUploadResponse createUploadUrl(MediaUploadRequest request) {
    String storageKey = "media/" + request.mediaType().name().toLowerCase() + "/" + UUID.randomUUID();
    String uploadUrl = uploadBaseUrl + "/" + storageKey;
    return new MediaUploadResponse(uploadUrl, storageKey);
  }
}
