import { Injectable } from '@angular/core';
import { 
  ExportRequest, 
  ExportMetadata, 
  ExportStatus 
} from '../../domain/model/entities/export-request.entity';
import { 
  ExportResponse, 
  ExportMetadataResponse 
} from '../response/export.response';
import { 
  ExportDownloadRequest, 
  ExportEmailRequest 
} from '../request/export.request';

@Injectable({
  providedIn: 'root'
})
export class ExportAssembler {

  toEntity(response: ExportResponse): ExportRequest {
    return {
      id: response.id,
      reportId: response.reportId,
      format: response.format,
      period: response.period,
      email: response.email,
      requestedAt: new Date(response.requestedAt),
      status: this.mapStringToExportStatus(response.status),
      metadata: this.toExportMetadataEntity(response.metadata)
    };
  }

  toEntityList(responses: ExportResponse[]): ExportRequest[] {
    return responses.map(response => this.toEntity(response));
  }

  toDownloadRequest(
    reportId: string, 
    format: string, 
    userId?: string
  ): ExportDownloadRequest {
    return {
      reportId,
      format: format as 'pdf' | 'excel' | 'csv' | 'json',
      userId
    };
  }

  toEmailRequest(
    reportId: string, 
    email: string,
    options?: {
      subject?: string;
      message?: string;
      language?: 'en' | 'es';
      userId?: string;
    }
  ): ExportEmailRequest {
    return {
      reportId,
      email,
      subject: options?.subject,
      message: options?.message,
      language: options?.language ?? 'en',
      userId: options?.userId
    };
  }

  private toExportMetadataEntity(response: ExportMetadataResponse): ExportMetadata {
    return {
      fileName: response.fileName,
      fileSize: response.fileSize,
      downloadUrl: response.downloadUrl,
      expiresAt: response.expiresAt ? new Date(response.expiresAt) : undefined,
      language: response.language,
      includeCharts: response.includeCharts,
      includeSummary: response.includeSummary
    };
  }

  private mapStringToExportStatus(status: string): ExportStatus {
    switch (status) {
      case 'pending': return ExportStatus.PENDING;
      case 'processing': return ExportStatus.PROCESSING;
      case 'completed': return ExportStatus.COMPLETED;
      case 'failed': return ExportStatus.FAILED;
      case 'expired': return ExportStatus.EXPIRED;
      default: return ExportStatus.PENDING;
    }
  }

  mapExportStatusToString(status: ExportStatus): string {
    switch (status) {
      case ExportStatus.PENDING: return 'pending';
      case ExportStatus.PROCESSING: return 'processing';
      case ExportStatus.COMPLETED: return 'completed';
      case ExportStatus.FAILED: return 'failed';
      case ExportStatus.EXPIRED: return 'expired';
    }
  }
}