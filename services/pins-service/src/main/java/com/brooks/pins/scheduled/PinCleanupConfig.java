package com.brooks.pins.scheduled;

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
  private boolean enabled = true;

  /**
   * Number of pins to delete in each batch.
   * Smaller batches reduce lock contention but take longer.
   */
  private int batchSize = 1000;

  /**
   * Number of days to keep expired pins before deletion.
   * Provides a grace period for debugging or recovery.
   * Default: 7 days
   */
  private int retentionDays = 7;

  /**
   * Cron expression for scheduling the cleanup job.
   * Default: "0 0 2 * * ?" (2 AM daily)
   */
  private String cron = "0 0 2 * * ?";

  // Getters and setters
  public boolean isEnabled() {
    return enabled;
  }

  public void setEnabled(boolean enabled) {
    this.enabled = enabled;
  }

  public int getBatchSize() {
    return batchSize;
  }

  public void setBatchSize(int batchSize) {
    this.batchSize = batchSize;
  }

  public int getRetentionDays() {
    return retentionDays;
  }

  public void setRetentionDays(int retentionDays) {
    this.retentionDays = retentionDays;
  }

  public String getCron() {
    return cron;
  }

  public void setCron(String cron) {
    this.cron = cron;
  }
}
