import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { apiGatewayUrl } from '../../../../core/config/api-gateway.config';
import {
  ConsumptionByCategoryResponse,
  DailyConsumptionResponse,
  DeviceResponse,
  MonthlyComparisonResponse,
  UnifiedDashboardResponse
} from '../response/dashboard.response';
import {
  ConsumptionByCategoryRequest,
  DailyConsumptionRequest,
  DashboardStatsRequest,
  DevicesRequest,
  MonthlyComparisonRequest
} from '../request/dashboard.request';

@Injectable({
  providedIn: 'root'
})
export class DashboardResource {
  private readonly monitoringUrl = apiGatewayUrl('monitoring');
  private readonly analyticsUrl = apiGatewayUrl('analytics');
  private readonly devicesUrl = apiGatewayUrl('devices');
  private readonly alertsUrl = apiGatewayUrl('alerts');

  constructor(private readonly http: HttpClient) {}

  getDashboardStats(request: DashboardStatsRequest): Observable<UnifiedDashboardResponse> {
    return this.http.get<UnifiedDashboardResponse>(`${this.monitoringUrl}/dashboard`);
  }

  getDailyConsumption(request: DailyConsumptionRequest): Observable<DailyConsumptionResponse> {
    const path = request.date ? `/consumption/daily/${request.date}` : '/consumption/daily';
    return this.http.get<DailyConsumptionResponse>(`${this.monitoringUrl}${path}`);
  }

  getConsumptionByCategory(request: ConsumptionByCategoryRequest): Observable<ConsumptionByCategoryResponse> {
    return this.http.get<ConsumptionByCategoryResponse>(`${this.monitoringUrl}/consumption/categories`);
  }

  getMonthlyComparison(request: MonthlyComparisonRequest): Observable<MonthlyComparisonResponse> {
    return this.http.get<MonthlyComparisonResponse>(`${this.analyticsUrl}/comparison/monthly`);
  }

  getDevices(request: DevicesRequest): Observable<DeviceResponse[]> {
    let params = new HttpParams();
    if (request.status) params = params.set('status', request.status);

    return this.http.get<DeviceResponse[]>(this.devicesUrl, { params }).pipe(
      catchError(() => of([]))
    );
  }

  getAlerts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.alertsUrl}/history`).pipe(
      catchError(() => of([]))
    );
  }
}
