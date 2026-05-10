export interface ExportResponse {
  id: string;
  reportId: string;
  format: string;
  period: string;
  email?: string;
  requestedAt: string; // ISO date string
  completedAt?: string; // ISO date string
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'expired';
  metadata: ExportMetadataResponse;
  downloadUrl?: string;
  errorMessage?: string;
}

export interface ExportMetadataResponse {
  fileName: string;
  fileSize?: number;
  downloadUrl?: string;
  expiresAt?: string; // ISO date string
  language: 'en' | 'es';
  includeCharts: boolean;
  includeSummary: boolean;
  contentType: string;
}

export interface ExportDownloadResponse {
  fileName: string;
  contentType: string;
  fileSize: number;
  downloadUrl: string;
  expiresAt: string; // ISO date string
}

export interface ExportEmailResponse {
  success: boolean;
  messageId?: string;
  sentAt: string; // ISO date string
  recipients: string[];
  errorMessage?: string;
}

export interface ExportHistoryResponse {
  exports: ExportResponse[];
  total: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
}