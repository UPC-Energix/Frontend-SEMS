export interface ExportRequest {
  id: string;
  reportId: string;
  format: string;
  period: string;
  email?: string;
  requestedAt: Date;
  status: ExportStatus;
  metadata: ExportMetadata;
}

export interface ExportMetadata {
  fileName: string;
  fileSize?: number;
  downloadUrl?: string;
  expiresAt?: Date;
  language: 'en' | 'es';
  includeCharts: boolean;
  includeSummary: boolean;
}

export enum ExportStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  EXPIRED = 'expired'
}