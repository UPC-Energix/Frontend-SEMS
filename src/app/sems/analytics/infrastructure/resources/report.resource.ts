import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiGatewayUrl } from '../../../../core/config/api-gateway.config';
import {
  ReportGenerationRequest,
  ReportFilterRequest
} from '../request/report.request';
import {
  ReportResponse,
  ReportListResponse
} from '../response/report.response';

@Injectable({
  providedIn: 'root'
})
export class ReportResource {
  private readonly reportsUrl = apiGatewayUrl('reports');
  private readonly analyticsUrl = apiGatewayUrl('analytics');

  constructor(private http: HttpClient) { }

  generateReport(request: ReportGenerationRequest): Observable<ReportResponse> {
    return this.http.post<ReportResponse>(`${this.reportsUrl}/generate`, request);
  }

  getReport(id: string): Observable<ReportResponse> {
    return this.http.get<ReportResponse>(`${this.reportsUrl}/${id}`);
  }

  getReportHistory(filter?: ReportFilterRequest): Observable<ReportListResponse> {
    let params = new HttpParams();

    if (filter) {
      if (filter.userId) params = params.set('userId', filter.userId);
      if (filter.type) params = params.set('type', filter.type);
      if (filter.format) params = params.set('format', filter.format);
      if (filter.period) params = params.set('period', filter.period);
      if (filter.startDate) params = params.set('startDate', filter.startDate);
      if (filter.endDate) params = params.set('endDate', filter.endDate);
      if (filter.limit) params = params.set('limit', filter.limit.toString());
      if (filter.offset) params = params.set('offset', filter.offset.toString());
    }

    return this.http.get<ReportListResponse>(this.reportsUrl, { params });
  }

  deleteReport(id: string): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`${this.reportsUrl}/${id}`);
  }

  getReportData(id: string, includeCharts: boolean = true): Observable<any> {
    const params = new HttpParams().set('includeCharts', includeCharts.toString());
    return this.http.get(`${this.reportsUrl}/${id}/data`, { params });
  }

  getWeeklyConsumption(userId?: number): Observable<any> {
    let params = new HttpParams();
    if (userId) {
      params = params.set('userId', userId.toString());
    }
    return this.http.get<any>(`${this.analyticsUrl}/reports/weekly-consumption`, { params });
  }

  getTopDevices(userId?: number): Observable<any> {
    let params = new HttpParams();
    if (userId) {
      params = params.set('userId', userId.toString());
    }
    return this.http.get<any>(`${this.analyticsUrl}/ranking/top-devices`, { params });
  }
}
