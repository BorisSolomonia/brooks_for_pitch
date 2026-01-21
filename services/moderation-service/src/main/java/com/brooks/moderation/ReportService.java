package com.brooks.moderation;

import com.brooks.security.SecurityContextUtil;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ReportService {
  private final ReportRepository reportRepository;

  public ReportService(ReportRepository reportRepository) {
    this.reportRepository = reportRepository;
  }

  @Transactional
  public void create(ReportRequest request) {
    UUID reporterId = SecurityContextUtil.currentUserId();
    if (reporterId == null) {
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing user context");
    }
    ReportEntity report = new ReportEntity();
    report.setReporterId(reporterId);
    report.setTargetType(request.targetType());
    report.setTargetId(UUID.fromString(request.targetId()));
    report.setReason(request.reason());
    report.setDetails(request.details());
    reportRepository.save(report);
  }
}
