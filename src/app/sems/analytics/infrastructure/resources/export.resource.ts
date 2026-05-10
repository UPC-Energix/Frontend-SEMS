import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiGatewayUrl } from '../../../../core/config/api-gateway.config';
import { 
  ExportDownloadRequest, 
  ExportEmailRequest, 
  ExportStatusRequest,
  ExportHistoryRequest 
} from '../request/export.request';
import { 
  ExportResponse, 
  ExportDownloadResponse, 
  ExportEmailResponse,
  ExportHistoryResponse 
} from '../response/export.response';

@Injectable({
  providedIn: 'root'
})
export class ExportResource {
  private readonly reportsUrl = apiGatewayUrl('reports');

  constructor(private http: HttpClient) {}

  createExportRequest(reportId: string, format: string): Observable<ExportResponse> {
    const request = { reportId, format };
    return this.http.post<ExportResponse>(`${this.reportsUrl}/exports`, request);
  }

  getExportStatus(request: ExportStatusRequest): Observable<ExportResponse> {
    return this.http.get<ExportResponse>(`${this.reportsUrl}/exports/${request.exportId}/status`);
  }

  downloadReport(request: ExportDownloadRequest): Observable<Blob> {
    const params = new HttpParams()
      .set('format', request.format)
      .set('userId', request.userId || '');

    return this.http.get(`${this.reportsUrl}/${request.reportId}/download`, {
      params,
      responseType: 'blob'
    });
  }

  getDownloadUrl(request: ExportDownloadRequest): Observable<ExportDownloadResponse> {
    const params = new HttpParams()
      .set('format', request.format)
      .set('userId', request.userId || '');

    return this.http.get<ExportDownloadResponse>(`${this.reportsUrl}/${request.reportId}/download-url`, { params });
  }

  sendReportByEmail(request: ExportEmailRequest): Observable<ExportEmailResponse> {
    return this.http.post<ExportEmailResponse>(`${this.reportsUrl}/send-email`, request);
  }

  getExportHistory(request?: ExportHistoryRequest): Observable<ExportHistoryResponse> {
    let params = new HttpParams();
    
    if (request) {
      if (request.userId) params = params.set('userId', request.userId);
      if (request.status) params = params.set('status', request.status);
      if (request.startDate) params = params.set('startDate', request.startDate);
      if (request.endDate) params = params.set('endDate', request.endDate);
      if (request.limit) params = params.set('limit', request.limit.toString());
      if (request.offset) params = params.set('offset', request.offset.toString());
    }

    return this.http.get<ExportHistoryResponse>(`${this.reportsUrl}/exports`, { params });
  }

  cancelExport(exportId: string): Observable<{ success: boolean }> {
    return this.http.put<{ success: boolean }>(`${this.reportsUrl}/exports/${exportId}/cancel`, {});
  }
}
