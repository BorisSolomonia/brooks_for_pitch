package com.brooks.app.media;

import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class MediaService {
  public MediaUploadResponse createUploadUrl(MediaUploadRequest request) {
    String storageKey = "media/" + UUID.randomUUID();
    String uploadUrl = "https://upload.example.com/" + storageKey;
    return new MediaUploadResponse(uploadUrl, storageKey);
  }
}
