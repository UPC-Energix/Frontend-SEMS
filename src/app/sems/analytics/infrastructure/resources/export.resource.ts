import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
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
  constructor(private http: HttpClient) {}

  createExportRequest(reportId: string, format: string): Observable<ExportResponse> {
    return of(this.mockExport(reportId, format));
  }

  getExportStatus(request: ExportStatusRequest): Observable<ExportResponse> {
    return of(this.mockExport(request.exportId, 'pdf'));
  }

  downloadReport(request: ExportDownloadRequest): Observable<Blob> {
    return of(new Blob(['Reporte SEMS simulado'], { type: 'text/plain' }));
  }

  getDownloadUrl(request: ExportDownloadRequest): Observable<ExportDownloadResponse> {
    return of({
      fileName: `reporte-sems.${request.format}`,
      contentType: 'application/octet-stream',
      fileSize: 1024,
      downloadUrl: '#',
      expiresAt: new Date(Date.now() + 3600000).toISOString()
    });
  }

  sendReportByEmail(request: ExportEmailRequest): Observable<ExportEmailResponse> {
    return of({
      success: true,
      messageId: `msg-${Date.now()}`,
      sentAt: new Date().toISOString(),
      recipients: [request.email]
    });
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

    return of({
      exports: [this.mockExport('report-1', 'pdf')],
      total: 1,
      page: 1,
      limit: request?.limit ?? 10,
      hasNextPage: false
    });
  }

  cancelExport(exportId: string): Observable<{ success: boolean }> {
    return of({ success: true });
  }

  private mockExport(reportId: string, format: string): ExportResponse {
    return {
      id: `export-${Date.now()}`,
      reportId,
      format,
      period: 'last_week',
      requestedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      status: 'completed',
      downloadUrl: '#',
      metadata: {
        fileName: `reporte-sems.${format}`,
        fileSize: 1024,
        downloadUrl: '#',
        expiresAt: new Date(Date.now() + 3600000).toISOString(),
        language: 'es',
        includeCharts: true,
        includeSummary: true,
        contentType: 'application/octet-stream'
      }
    };
  }
}
