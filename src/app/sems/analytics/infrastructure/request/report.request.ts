export interface ReportGenerationRequest {
  type: 'weekly_consumption' | 'device_ranking' | 'comprehensive' | 'custom';
  format: 'pdf' | 'excel' | 'csv' | 'json';
  period: 'last_week' | 'last_month' | 'last_quarter' | 'last_year' | 'custom_range';
  startDate?: string; // ISO date string
  endDate?: string; // ISO date string
  deviceIds?: string[];
  includeCharts?: boolean;
  includeSummary?: boolean;
  language?: 'en' | 'es';
  userId?: string;
}

export interface ReportFilterRequest {
  userId?: string;
  type?: string;
  format?: string;
  period?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}