import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import {
  ReportGenerationRequest,
  ReportFilterRequest
} from '../request/report.request';
import {
  ReportResponse,
  ReportListResponse
} from '../response/report.response';

@Injectable({
  providedIn: 'root'
})
export class ReportResource {
  constructor(private http: HttpClient) { }

  generateReport(request: ReportGenerationRequest): Observable<ReportResponse> {
    return of(this.mockReport(request));
  }

  getReport(id: string): Observable<ReportResponse> {
    return of(this.mockReport({ type: 'comprehensive', format: 'pdf', period: 'last_week' }, id));
  }

  getReportHistory(filter?: ReportFilterRequest): Observable<ReportListResponse> {
    let params = new HttpParams();

    if (filter) {
      if (filter.userId) params = params.set('userId', filter.userId);
      if (filter.type) params = params.set('type', filter.type);
      if (filter.format) params = params.set('format', filter.format);
      if (filter.period) params = params.set('period', filter.period);
      if (filter.startDate) params = params.set('startDate', filter.startDate);
      if (filter.endDate) params = params.set('endDate', filter.endDate);
      if (filter.limit) params = params.set('limit', filter.limit.toString());
      if (filter.offset) params = params.set('offset', filter.offset.toString());
    }

    return of({
      reports: [this.mockReport({ type: 'comprehensive', format: 'pdf', period: 'last_week' })],
      total: 1,
      page: 1,
      limit: filter?.limit ?? 10,
      hasNextPage: false
    });
  }

  deleteReport(id: string): Observable<{ success: boolean }> {
    return of({ success: true });
  }

  getReportData(id: string, includeCharts: boolean = true): Observable<any> {
    return of(this.mockReport({ type: 'comprehensive', format: 'pdf', period: 'last_week' }, id).data);
  }

  getWeeklyConsumption(userId?: number): Observable<any> {
    return of(this.mockReport({ type: 'weekly_consumption', format: 'pdf', period: 'last_week' }).data.weeklyConsumption);
  }

  getTopDevices(userId?: number): Observable<any> {
    return of(this.mockReport({ type: 'device_ranking', format: 'pdf', period: 'last_week' }).data.deviceRanking);
  }

  private mockReport(request: ReportGenerationRequest, id = `report-${Date.now()}`): ReportResponse {
    return {
      id,
      type: request.type,
      format: request.format,
      period: request.period,
      generatedAt: new Date().toISOString(),
      status: 'generated',
      data: {
        totalConsumption: 126.4,
        averageConsumption: 18.1,
        peakConsumption: 28.7,
        efficiencyScore: 84,
        weeklyConsumption: [
          {
            weekStartDate: '2026-05-04',
            weekEndDate: '2026-05-10',
            totalWeeklyConsumption: 126.4,
            dailyConsumptions: [
              { date: '2026-05-04', dayName: 'Lun', consumption: 15.2 },
              { date: '2026-05-05', dayName: 'Mar', consumption: 17.8 },
              { date: '2026-05-06', dayName: 'Mie', consumption: 16.9 },
              { date: '2026-05-07', dayName: 'Jue', consumption: 21.3 },
              { date: '2026-05-08', dayName: 'Vie', consumption: 18.7 },
              { date: '2026-05-09', dayName: 'Sab', consumption: 20.1 },
              { date: '2026-05-10', dayName: 'Dom', consumption: 16.4 }
            ]
          }
        ],
        deviceRanking: [
          { deviceId: 1, deviceName: 'Aire acondicionado', deviceType: 'HVAC', deviceCategory: 'Climatizacion', totalConsumption: 48, period: request.period },
          { deviceId: 2, deviceName: 'Refrigeradora', deviceType: 'Appliance', deviceCategory: 'Cocina', totalConsumption: 34, period: request.period },
          { deviceId: 3, deviceName: 'Luces dormitorio', deviceType: 'Lighting', deviceCategory: 'Iluminacion', totalConsumption: 18, period: request.period }
        ],
        summary: {
          totalDevices: 3,
          activeDevices: 2,
          totalConsumptionPeriod: 126.4,
          averageConsumptionPerDevice: 42.1,
          mostEfficientDevice: 'Luces dormitorio',
          leastEfficientDevice: 'Aire acondicionado',
          recommendations: [
            'Programa apagados automaticos en horas de baja actividad.',
            'Revisa el consumo de climatizacion en horas pico.'
          ]
        }
      },
      metadata: {
        title: 'Reporte semanal de energia',
        description: 'Datos simulados mientras se conecta el backend.',
        generatedBy: 'SEMS Mock',
        language: request.language ?? 'es',
        version: '1.0'
      }
    };
  }
}
