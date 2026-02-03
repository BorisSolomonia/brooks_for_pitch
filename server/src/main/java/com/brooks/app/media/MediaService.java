package com.brooks.app.media;

import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class MediaService {
  private final String uploadBaseUrl;

  public MediaService(@Value("${media.upload-base-url}") String uploadBaseUrl) {
    this.uploadBaseUrl = uploadBaseUrl;
  }

  public MediaUploadResponse createUploadUrl(MediaUploadRequest request) {
    String storageKey = "media/" + UUID.randomUUID();
    String uploadUrl = uploadBaseUrl.replaceAll("/+$", "") + "/" + storageKey;
    return new MediaUploadResponse(uploadUrl, storageKey);
  }
}
