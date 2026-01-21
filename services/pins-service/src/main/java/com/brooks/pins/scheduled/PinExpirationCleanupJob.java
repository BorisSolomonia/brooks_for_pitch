package com.brooks.pins.scheduled;

import com.brooks.pins.PinRepository;
import java.time.Instant;
import java.util.concurrent.atomic.AtomicInteger;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Scheduled job to clean up expired pins.
 * Runs daily at 2 AM to delete pins past their expiration date.
 *
 * <p>This prevents the database from growing indefinitely and maintains
 * query performance by removing stale data.
 *
 * <p>Configuration can be adjusted via application properties:
 * - brooks.cleanup.enabled: Enable/disable the job (default: true)
 * - brooks.cleanup.batch-size: Number of pins to delete per batch (default: 1000)
 * - brooks.cleanup.retention-days: Extra days to keep expired pins (default: 7)
 */
@Component
public class PinExpirationCleanupJob {
  private static final Logger log = LoggerFactory.getLogger(PinExpirationCleanupJob.class);

  private final PinRepository pinRepository;
  private final PinCleanupConfig config;

  public PinExpirationCleanupJob(
      PinRepository pinRepository,
      PinCleanupConfig config
  ) {
    this.pinRepository = pinRepository;
    this.config = config;
  }

  /**
   * Scheduled cleanup job that runs daily at 2 AM server time.
   * Uses cron expression: "0 0 2 * * ?" (second minute hour day month weekday)
   */
  @Scheduled(cron = "${brooks.cleanup.cron:0 0 2 * * ?}")
  @Transactional
  public void cleanupExpiredPins() {
    if (!config.isEnabled()) {
      log.debug("Pin cleanup job is disabled");
      return;
    }

    log.info("Starting expired pin cleanup job");
    long startTime = System.currentTimeMillis();

    try {
      Instant cutoffTime = Instant.now().minusSeconds(
          config.getRetentionDays() * 24 * 3600L
      );

      AtomicInteger totalDeleted = new AtomicInteger(0);
      int batchSize = config.getBatchSize();

      // Delete in batches to avoid long-running transactions
      while (true) {
        int deleted = pinRepository.deleteExpiredPins(cutoffTime, batchSize);
        totalDeleted.addAndGet(deleted);

        log.debug("Deleted {} expired pins in current batch", deleted);

        if (deleted < batchSize) {
          // No more pins to delete
          break;
        }

        // Small delay between batches to reduce DB load
        try {
          Thread.sleep(100);
        } catch (InterruptedException e) {
          Thread.currentThread().interrupt();
          log.warn("Cleanup job interrupted", e);
          break;
        }
      }

      long duration = System.currentTimeMillis() - startTime;
      log.info("Expired pin cleanup completed. Deleted {} pins in {}ms",
          totalDeleted.get(), duration);

      // Record metrics if available
      recordMetrics(totalDeleted.get(), duration);

    } catch (Exception e) {
      log.error("Error during pin cleanup job", e);
      throw e; // Re-throw to trigger retry or alerting
    }
  }

  /**
   * Manual trigger for the cleanup job.
   * Can be called via JMX or admin endpoint for immediate cleanup.
   */
  public CleanupResult runManualCleanup() {
    log.info("Manual cleanup triggered");
    long startTime = System.currentTimeMillis();

    Instant cutoffTime = Instant.now().minusSeconds(
        config.getRetentionDays() * 24 * 3600L
    );

    int totalDeleted = 0;
    int batchSize = config.getBatchSize();

    while (true) {
      int deleted = pinRepository.deleteExpiredPins(cutoffTime, batchSize);
      totalDeleted += deleted;

      if (deleted < batchSize) {
        break;
      }
    }

    long duration = System.currentTimeMillis() - startTime;
    log.info("Manual cleanup completed. Deleted {} pins in {}ms", totalDeleted, duration);

    return new CleanupResult(totalDeleted, duration, cutoffTime);
  }

  private void recordMetrics(int deletedCount, long durationMs) {
    // TODO: Integrate with Micrometer metrics
    // meterRegistry.counter("pins.cleanup.deleted").increment(deletedCount);
    // meterRegistry.timer("pins.cleanup.duration").record(Duration.ofMillis(durationMs));
  }

  /**
   * Result of a cleanup operation.
   */
  public record CleanupResult(
      int deletedCount,
      long durationMs,
      Instant cutoffTime
  ) {}
}
