import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { apiGatewayUrl } from '../../../../core/config/api-gateway.config';
import { Device, DeviceProtocol, DeviceStatus } from '../../domain/model/device.entity';
import { DeviceRepository } from '../../domain/model/repositories/device.repository';

export interface DeviceResponse {
  id?: number | string;
  userId?: string;
  name: string;
  category: string;
  type: string;
  status: string;
  lastActivity?: string;
  lastActive?: string;
  location: string;
  active?: boolean;
  isActive?: boolean | number;
  brand?: string;
  model?: string;
  protocol?: 'WIFI' | 'BLUETOOTH' | string;
}

@Injectable({
  providedIn: 'root'
})
export class DeviceRepositoryImpl implements DeviceRepository {
  private readonly devicesUrl = apiGatewayUrl('devices');

  constructor(private readonly http: HttpClient) {}

  getAllDevices(): Observable<Device[]> {
    return this.http.get<DeviceResponse[]>(this.devicesUrl).pipe(
      map(responses => responses.map(response => this.mapToDevice(response))),
      catchError(() => of([]))
    );
  }

  getDeviceById(id: string): Observable<Device | null> {
    return this.http.get<DeviceResponse>(`${this.devicesUrl}/${id}`).pipe(
      map(response => this.mapToDevice(response)),
      catchError(() => of(null))
    );
  }

  getDevicesByStatus(status: string): Observable<Device[]> {
    return this.http.get<DeviceResponse[]>(`${this.devicesUrl}?status=${encodeURIComponent(status)}`).pipe(
      map(responses => responses.map(response => this.mapToDevice(response))),
      catchError(() => of([]))
    );
  }

  getDevicesByCategory(category: string): Observable<Device[]> {
    return this.http.get<DeviceResponse[]>(`${this.devicesUrl}?category=${encodeURIComponent(category)}`).pipe(
      map(responses => responses.map(response => this.mapToDevice(response))),
      catchError(() => of([]))
    );
  }

  createDevice(device: Device): Observable<Device> {
    return this.http.post<DeviceResponse>(`${this.devicesUrl}/link`, this.mapToDeviceRequest(device)).pipe(
      map(response => this.mapToDevice(response))
    );
  }

  updateDevice(device: Device): Observable<Device> {
    return this.http.put<DeviceResponse>(`${this.devicesUrl}/${device.id}`, this.mapToDeviceRequest(device)).pipe(
      map(response => this.mapToDevice(response))
    );
  }

  deleteDevice(id: string): Observable<boolean> {
    return this.http.delete<void>(`${this.devicesUrl}/${id}`).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

  toggleDevice(id: string): Observable<Device> {
    return this.http.post<DeviceResponse>(`${this.devicesUrl}/${id}/toggle`, {}).pipe(
      map(response => this.mapToDevice(response))
    );
  }

  private mapToDevice(response: DeviceResponse): Device {
    const active = response.active ?? response.isActive ?? response.status === 'ON' ?? false;

    return {
      id: response.id?.toString() || '',
      name: response.name,
      category: response.category,
      type: response.type,
      brand: response.brand || '',
      model: response.model || '',
      protocol: response.protocol === DeviceProtocol.BLUETOOTH ? DeviceProtocol.BLUETOOTH : DeviceProtocol.WIFI,
      status: response.status as DeviceStatus,
      realTimeStatus: response.status,
      lastActive: response.lastActivity || response.lastActive || '',
      alertHistory: undefined,
      energyConsumption: undefined,
      location: response.location,
      isActive: active === true || active === 1 ? 1 : 0
    };
  }

  private mapToDeviceRequest(device: Device): Record<string, unknown> {
    return {
      name: device.name,
      category: device.category,
      type: device.type,
      brand: device.brand,
      model: device.model,
      protocol: device.protocol,
      status: device.status,
      location: device.location,
      active: device.isActive === 1,
      externalHardware: device.type?.toUpperCase() === 'EOS' ? 'EOS' : undefined
    };
  }
}
