import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ExportRepository, EmailDeliveryParams } from '../../domain/model/repositories/export.repository';
import { ExportRequest, ExportStatus } from '../../domain/model/entities/export-request.entity';
import { ExportResource } from '../resources/export.resource';
import { ExportAssembler } from '../assemblers/export.assembler';
import { ExportHistoryRequest } from '../request/export.request';

@Injectable({
  providedIn: 'root'
})
export class ExportRepositoryImpl implements ExportRepository {

  constructor(
    private exportResource: ExportResource,
    private exportAssembler: ExportAssembler
  ) {}

  createExportRequest(request: Partial<ExportRequest>): Observable<ExportRequest> {
    if (!request.reportId || !request.format) {
      throw new Error('Report ID and format are required');
    }
    
    return this.exportResource.createExportRequest(request.reportId, request.format).pipe(
      map(response => this.exportAssembler.toEntity(response))
    );
  }

  getExportRequest(id: string): Observable<ExportRequest> {
    return this.exportResource.getExportStatus({ exportId: id }).pipe(
      map(response => this.exportAssembler.toEntity(response))
    );
  }

  updateExportStatus(id: string, status: ExportStatus): Observable<ExportRequest> {
    // This would typically be handled by the backend, but we can simulate it
    return this.getExportRequest(id);
  }

  downloadReport(reportId: string, format?: string): Observable<Blob> {
    const request = this.exportAssembler.toDownloadRequest(
      reportId, 
      format || 'pdf'
    );
    return this.exportResource.downloadReport(request);
  }

  sendReportByEmail(reportId: string, email: string, params?: EmailDeliveryParams): Observable<boolean> {
    const request = this.exportAssembler.toEmailRequest(reportId, email, {
      subject: params?.subject,
      message: params?.message,
      language: params?.language,
      userId: params?.reportId // Assuming userId might be passed in params
    });
    
    return this.exportResource.sendReportByEmail(request).pipe(
      map(response => response.success)
    );
  }

  getExportHistory(userId?: string): Observable<ExportRequest[]> {
    const request: ExportHistoryRequest = {
      userId,
      limit: 50,
      offset: 0
    };
    
    return this.exportResource.getExportHistory(request).pipe(
      map(response => this.exportAssembler.toEntityList(response.exports))
    );
  }

  getExportHistoryWithFilter(filter: ExportHistoryRequest): Observable<ExportRequest[]> {
    return this.exportResource.getExportHistory(filter).pipe(
      map(response => this.exportAssembler.toEntityList(response.exports))
    );
  }

  cancelExport(exportId: string): Observable<boolean> {
    return this.exportResource.cancelExport(exportId).pipe(
      map(response => response.success)
    );
  }
}