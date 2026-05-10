export interface ExportDownloadRequest {
  reportId: string;
  format: 'pdf' | 'excel' | 'csv' | 'json';
  userId?: string;
}

export interface ExportEmailRequest {
  reportId: string;
  email: string;
  subject?: string;
  message?: string;
  language?: 'en' | 'es';
  userId?: string;
}

export interface ExportStatusRequest {
  exportId: string;
  userId?: string;
}

export interface ExportHistoryRequest {
  userId?: string;
  status?: 'pending' | 'processing' | 'completed' | 'failed' | 'expired';
  limit?: number;
  offset?: number;
  startDate?: string;
  endDate?: string;
}