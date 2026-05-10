import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
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
  constructor(private readonly http: HttpClient) {}

  getDashboardStats(request: DashboardStatsRequest): Observable<UnifiedDashboardResponse> {
    return of({
      monthlySavingGoalKwh: 80,
      estimatedSavingsPercent: 18,
      activeDevices: 2,
      estimatedBill: 142.5,
      todaysConsumptionKwh: 16.4,
      dailyConsumption: [
        { timestamp: '06:00', kwh: 1.5 },
        { timestamp: '09:00', kwh: 2.7 },
        { timestamp: '12:00', kwh: 3.1 },
        { timestamp: '15:00', kwh: 2.8 },
        { timestamp: '18:00', kwh: 4.4 },
        { timestamp: '21:00', kwh: 1.9 }
      ],
      categoryConsumption: [
        { category: 'Climatizacion', kwh: 48 },
        { category: 'Cocina', kwh: 34 },
        { category: 'Iluminacion', kwh: 18 },
        { category: 'Electronica', kwh: 26 }
      ],
      devices: [
        { id: 1, name: 'Aire acondicionado', category: 'Climatizacion' },
        { id: 2, name: 'Refrigeradora', category: 'Cocina' },
        { id: 3, name: 'Luces dormitorio', category: 'Iluminacion' }
      ],
      alerts: [
        { level: 'warning', message: 'Consumo alto detectado en climatizacion.' },
        { level: 'info', message: 'Recomendacion de ahorro disponible.' }
      ]
    });
  }

  getDailyConsumption(request: DailyConsumptionRequest): Observable<DailyConsumptionResponse> {
    return of({
      date: request.date ?? new Date().toISOString().slice(0, 10),
      dataPoints: [
        { time: '06:00', value: 1.5 },
        { time: '09:00', value: 2.7 },
        { time: '12:00', value: 3.1 },
        { time: '15:00', value: 2.8 },
        { time: '18:00', value: 4.4 },
        { time: '21:00', value: 1.9 }
      ],
      totalConsumption: 16.4,
      peakTime: '18:00',
      peakValue: 4.4
    });
  }

  getConsumptionByCategory(request: ConsumptionByCategoryRequest): Observable<ConsumptionByCategoryResponse> {
    return of({
      totalConsumption: 126.4,
      categories: [
        { name: 'Climatizacion', value: 48, percentage: 38, color: '#2563eb' },
        { name: 'Cocina', value: 34, percentage: 27, color: '#16a34a' },
        { name: 'Iluminacion', value: 18, percentage: 14, color: '#f59e0b' },
        { name: 'Electronica', value: 26, percentage: 21, color: '#dc2626' }
      ]
    });
  }

  getMonthlyComparison(request: MonthlyComparisonRequest): Observable<MonthlyComparisonResponse> {
    return of({
      currentMonth: 'Mayo',
      previousMonthComparison: -12,
      months: [
        { month: 'Ene', year: 2026, consumption: 152 },
        { month: 'Feb', year: 2026, consumption: 148 },
        { month: 'Mar', year: 2026, consumption: 139 },
        { month: 'Abr', year: 2026, consumption: 132 },
        { month: 'May', year: 2026, consumption: 126 }
      ]
    });
  }

  getDevices(request: DevicesRequest): Observable<DeviceResponse[]> {
    const devices: DeviceResponse[] = [
      { id: '1', name: 'Aire acondicionado', location: 'Sala', type: 'HVAC', brand: 'EcoAir', model: 'A120', status: 'ON', lastActive: new Date().toISOString(), consumption: 3.8 },
      { id: '2', name: 'Refrigeradora', location: 'Cocina', type: 'Appliance', brand: 'HomeFresh', model: 'RF90', status: 'ON', lastActive: new Date().toISOString(), consumption: 2.1 },
      { id: '3', name: 'Luces dormitorio', location: 'Dormitorio', type: 'Lighting', brand: 'Bright', model: 'LED Smart', status: 'OFF', lastActive: new Date().toISOString(), consumption: 0.4 }
    ];

    return of(request.status ? devices.filter(device => device.status === request.status) : devices);
  }

  getAlerts(): Observable<any[]> {
    return of([
      { level: 'warning', message: 'Consumo alto detectado en climatizacion.' },
      { level: 'info', message: 'Recomendacion de ahorro disponible.' }
    ]);
  }
}
