package com.brooks.pins.scheduled;

import java.util.Objects;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * Configuration properties for the pin cleanup job.
 * Allows customization via application.yml or environment variables.
 */
@Configuration
@ConfigurationProperties(prefix = "brooks.cleanup")
public class PinCleanupConfig {
  /**
   * Whether the cleanup job is enabled.
   * Set to false in development or to disable cleanup.
   */
  private Boolean enabled;

  /**
   * Number of pins to delete in each batch.
   * Smaller batches reduce lock contention but take longer.
   */
  private Integer batchSize;

  /**
   * Number of days to keep expired pins before deletion.
   * Provides a grace period for debugging or recovery.
   * Default: 7 days
   */
  private Integer retentionDays;

  /**
   * Cron expression for scheduling the cleanup job.
   * Default: "0 0 2 * * ?" (2 AM daily)
   */
  private String cron;

  // Getters and setters
  public boolean isEnabled() {
    return Objects.requireNonNull(enabled, "brooks.cleanup.enabled is required");
  }

  public void setEnabled(boolean enabled) {
    this.enabled = enabled;
  }

  public int getBatchSize() {
    return Objects.requireNonNull(batchSize, "brooks.cleanup.batch-size is required");
  }

  public void setBatchSize(int batchSize) {
    this.batchSize = batchSize;
  }

  public int getRetentionDays() {
    return Objects.requireNonNull(retentionDays, "brooks.cleanup.retention-days is required");
  }

  public void setRetentionDays(int retentionDays) {
    this.retentionDays = retentionDays;
  }

  public String getCron() {
    return Objects.requireNonNull(cron, "brooks.cleanup.cron is required");
  }

  public void setCron(String cron) {
    this.cron = cron;
  }
}
