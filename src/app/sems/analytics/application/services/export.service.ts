import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ExportRepositoryImpl } from '../../infrastructure/repositories/export-repository.impl';
import { ExportRequest } from '../../domain/model/entities/export-request.entity';
import { EmailDeliveryParams } from '../../domain/model/repositories/export.repository';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  constructor(private exportRepository: ExportRepositoryImpl) {}

  createExportRequest(reportId: string, format: string): Observable<ExportRequest> {
    return this.exportRepository.createExportRequest({ reportId, format });
  }

  downloadReport(reportId: string, format: string = 'pdf'): Observable<Blob> {
    return this.exportRepository.downloadReport(reportId, format);
  }

  sendReportByEmail(
    reportId: string, 
    email: string, 
    options?: {
      subject?: string;
      message?: string;
      language?: 'en' | 'es';
    }
  ): Observable<boolean> {
    const params: EmailDeliveryParams = {
      reportId,
      email,
      subject: options?.subject,
      message: options?.message,
      language: options?.language || 'en'
    };
    
    return this.exportRepository.sendReportByEmail(reportId, email, params);
  }

  getExportStatus(exportId: string): Observable<ExportRequest> {
    return this.exportRepository.getExportRequest(exportId);
  }

  getExportHistory(userId?: string): Observable<ExportRequest[]> {
    return this.exportRepository.getExportHistory(userId);
  }

  cancelExport(exportId: string): Observable<boolean> {
    return this.exportRepository.cancelExport(exportId);
  }

  // Utility methods
  getSupportedFormats(): string[] {
    return ['pdf', 'excel', 'csv', 'json'];
  }

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  getFormatFileExtension(format: string): string {
    switch (format.toLowerCase()) {
      case 'pdf': return '.pdf';
      case 'excel': return '.xlsx';
      case 'csv': return '.csv';
      case 'json': return '.json';
      default: return '.pdf';
    }
  }

  generateFileName(reportType: string, period: string, format: string): string {
    const timestamp = new Date().toISOString().split('T')[0];
    const extension = this.getFormatFileExtension(format);
    return `${reportType}_${period}_${timestamp}${extension}`;
  }
}