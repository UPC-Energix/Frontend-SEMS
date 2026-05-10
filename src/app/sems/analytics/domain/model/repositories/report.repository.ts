import { Observable } from 'rxjs';
import { Report, ReportType, ReportFormat, ReportPeriod } from '../entities/report.entity';
import { ReportFilterRequest } from '../../../infrastructure/request/report.request';

export interface ReportRepository {
  generateReport(type: ReportType, period: ReportPeriod, format: ReportFormat): Observable<Report>;
  generateReportWithParams(params: ReportGenerationParams): Observable<Report>;
  getReport(id: string): Observable<Report>;
  getReportHistory(userId?: string): Observable<Report[]>;
  getReportHistoryWithFilter(filter: ReportFilterRequest): Observable<Report[]>;
  deleteReport(id: string): Observable<boolean>;
}

export interface ReportGenerationParams {
  type: ReportType;
  period: ReportPeriod;
  format: ReportFormat;
  startDate?: Date;
  endDate?: Date;
  deviceIds?: string[];
  includeCharts?: boolean;
  includeSummary?: boolean;
  language?: 'en' | 'es';
}