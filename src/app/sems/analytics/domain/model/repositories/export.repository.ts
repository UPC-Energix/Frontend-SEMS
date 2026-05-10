import { Observable } from 'rxjs';
import { ExportRequest, ExportStatus } from '../entities/export-request.entity';
import { ExportHistoryRequest } from '../../../infrastructure/request/export.request';

export interface ExportRepository {
  createExportRequest(request: Partial<ExportRequest>): Observable<ExportRequest>;
  getExportRequest(id: string): Observable<ExportRequest>;
  updateExportStatus(id: string, status: ExportStatus): Observable<ExportRequest>;
  downloadReport(reportId: string, format?: string): Observable<Blob>;
  sendReportByEmail(reportId: string, email: string, params?: EmailDeliveryParams): Observable<boolean>;
  getExportHistory(userId?: string): Observable<ExportRequest[]>;
  getExportHistoryWithFilter(filter: ExportHistoryRequest): Observable<ExportRequest[]>;
  cancelExport(exportId: string): Observable<boolean>;
}

export interface EmailDeliveryParams {
  reportId: string;
  email: string;
  subject?: string;
  message?: string;
  language?: 'en' | 'es';
}