import { Injectable } from '@angular/core';
import { Observable, delay } from 'rxjs';
import { TokenService } from '../../../iam/infrastructure/services/token.service';
import { ReportRepositoryImpl } from '../../infrastructure/repositories/report-repository.impl';
import { ReportResource } from '../../infrastructure/resources/report.resource';
import { Report, ReportType, ReportFormat, ReportPeriod } from '../../domain/model/entities/report.entity';
import { ReportGenerationParams } from '../../domain/model/repositories/report.repository';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(
    private reportRepository: ReportRepositoryImpl,
    private reportResource: ReportResource,
    private tokenService: TokenService
  ) { }

  generateWeeklyConsumptionReport(format: ReportFormat = ReportFormat.PDF): Observable<Report> {
    return this.reportRepository.generateReport(
      ReportType.WEEKLY_CONSUMPTION,
      ReportPeriod.LAST_WEEK,
      format
    );
  }

  generateDeviceRankingReport(format: ReportFormat = ReportFormat.PDF): Observable<Report> {
    return this.reportRepository.generateReport(
      ReportType.DEVICE_RANKING,
      ReportPeriod.LAST_MONTH,
      format
    );
  }

  generateComprehensiveReport(
    period: ReportPeriod = ReportPeriod.LAST_MONTH,
    format: ReportFormat = ReportFormat.PDF
  ): Observable<Report> {
    return this.reportRepository.generateReport(
      ReportType.COMPREHENSIVE,
      period,
      format
    );
  }

  generateCustomReport(params: ReportGenerationParams): Observable<Report> {
    return this.reportRepository.generateReportWithParams(params);
  }

  getReport(id: string): Observable<Report> {
    return this.reportRepository.getReport(id);
  }

  getReportHistory(userId?: string): Observable<Report[]> {
    return this.reportRepository.getReportHistory(userId);
  }

  deleteReport(id: string): Observable<boolean> {
    return this.reportRepository.deleteReport(id);
  }

  // Utility methods for common report configurations
  getAvailableFormats(): ReportFormat[] {
    return [
      ReportFormat.PDF,
      ReportFormat.EXCEL,
      ReportFormat.CSV,
      ReportFormat.JSON
    ];
  }

  getAvailablePeriods(): ReportPeriod[] {
    return [
      ReportPeriod.LAST_WEEK,
      ReportPeriod.LAST_MONTH,
      ReportPeriod.LAST_QUARTER,
      ReportPeriod.LAST_YEAR
    ];
  }

  getAvailableTypes(): ReportType[] {
    return [
      ReportType.WEEKLY_CONSUMPTION,
      ReportType.DEVICE_RANKING,
      ReportType.COMPREHENSIVE,
      ReportType.CUSTOM
    ];
  }

  // Methods to get chart data from API
  getWeeklyConsumption(): Observable<any> {
    const userId = this.getCurrentUserId();

    return this.reportResource.getWeeklyConsumption(userId).pipe(
      delay(100)
    );
  }

  getTopDevices(): Observable<any> {
    const userId = this.getCurrentUserId();

    return this.reportResource.getTopDevices(userId).pipe(
      delay(100)
    );
  }

  private getCurrentUserId(): number | undefined {
    const userId = this.tokenService.getUser()?.id;
    return userId ? Number(userId) : undefined;
  }

  getReportSummary(): Observable<any> {
    return this.reportResource.getReportHistory({ limit: 1 }).pipe(delay(100));
  }
}
