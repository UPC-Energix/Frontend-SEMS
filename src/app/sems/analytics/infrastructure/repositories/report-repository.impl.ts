import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ReportRepository, ReportGenerationParams } from '../../domain/model/repositories/report.repository';
import { Report, ReportType, ReportFormat, ReportPeriod } from '../../domain/model/entities/report.entity';
import { ReportResource } from '../resources/report.resource';
import { ReportAssembler } from '../assemblers/report.assembler';
import { ReportFilterRequest } from '../request/report.request';

@Injectable({
  providedIn: 'root'
})
export class ReportRepositoryImpl implements ReportRepository {

  constructor(
    private reportResource: ReportResource,
    private reportAssembler: ReportAssembler
  ) {}

  generateReport(type: ReportType, period: ReportPeriod, format: ReportFormat): Observable<Report> {
    const request = this.reportAssembler.toRequest(type, format, period);
    return this.reportResource.generateReport(request).pipe(
      map(response => this.reportAssembler.toEntity(response))
    );
  }

  generateReportWithParams(params: ReportGenerationParams): Observable<Report> {
    const request = this.reportAssembler.toRequest(
      params.type,
      params.format,
      params.period,
      {
        startDate: params.startDate,
        endDate: params.endDate,
        deviceIds: params.deviceIds,
        includeCharts: params.includeCharts,
        includeSummary: params.includeSummary,
        language: params.language
      }
    );
    return this.reportResource.generateReport(request).pipe(
      map(response => this.reportAssembler.toEntity(response))
    );
  }

  getReport(id: string): Observable<Report> {
    return this.reportResource.getReport(id).pipe(
      map(response => this.reportAssembler.toEntity(response))
    );
  }

  getReportHistory(userId?: string): Observable<Report[]> {
    const filter: ReportFilterRequest = {
      userId,
      limit: 50,
      offset: 0
    };
    
    return this.reportResource.getReportHistory(filter).pipe(
      map(response => this.reportAssembler.toEntityList(response.reports))
    );
  }

  getReportHistoryWithFilter(filter: ReportFilterRequest): Observable<Report[]> {
    return this.reportResource.getReportHistory(filter).pipe(
      map(response => this.reportAssembler.toEntityList(response.reports))
    );
  }

  deleteReport(id: string): Observable<boolean> {
    return this.reportResource.deleteReport(id).pipe(
      map(response => response.success)
    );
  }
}