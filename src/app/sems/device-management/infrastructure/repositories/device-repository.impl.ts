import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
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
  private devices: DeviceResponse[] = [
    {
      id: 1,
      userId: '1',
      name: 'Aire acondicionado',
      category: 'Climatizacion',
      type: 'HVAC',
      status: 'ON',
      location: 'Sala',
      active: true,
      brand: 'EcoAir',
      model: 'A120',
      protocol: 'WIFI',
      lastActive: new Date().toISOString()
    },
    {
      id: 2,
      userId: '1',
      name: 'Refrigeradora',
      category: 'Cocina',
      type: 'Appliance',
      status: 'ON',
      location: 'Cocina',
      active: true,
      brand: 'HomeFresh',
      model: 'RF90',
      protocol: 'WIFI',
      lastActive: new Date().toISOString()
    },
    {
      id: 3,
      userId: '1',
      name: 'Luces dormitorio',
      category: 'Iluminacion',
      type: 'Lighting',
      status: 'OFF',
      location: 'Dormitorio',
      active: false,
      brand: 'Bright',
      model: 'LED Smart',
      protocol: 'BLUETOOTH',
      lastActive: new Date().toISOString()
    }
  ];

  constructor(private readonly http: HttpClient) {}

  getAllDevices(): Observable<Device[]> {
    return of(this.devices.map(response => this.mapToDevice(response)));
  }

  getDeviceById(id: string): Observable<Device | null> {
    const device = this.devices.find(item => String(item.id) === id);
    return of(device ? this.mapToDevice(device) : null);
  }

  getDevicesByStatus(status: string): Observable<Device[]> {
    return of(this.devices
      .filter(item => item.status.toLowerCase() === status.toLowerCase())
      .map(response => this.mapToDevice(response)));
  }

  getDevicesByCategory(category: string): Observable<Device[]> {
    return of(this.devices
      .filter(item => item.category.toLowerCase() === category.toLowerCase())
      .map(response => this.mapToDevice(response)));
  }

  createDevice(device: Device): Observable<Device> {
    const created: DeviceResponse = {
      id: Date.now(),
      userId: '1',
      name: device.name,
      category: device.category,
      type: device.type,
      status: device.status,
      location: device.location,
      active: device.isActive === 1,
      brand: device.brand,
      model: device.model,
      protocol: device.protocol,
      lastActive: new Date().toISOString()
    };
    this.devices = [...this.devices, created];
    return of(this.mapToDevice(created));
  }

  updateDevice(device: Device): Observable<Device> {
    const updated: DeviceResponse = {
      id: device.id,
      userId: '1',
      name: device.name,
      category: device.category,
      type: device.type,
      status: device.status,
      location: device.location,
      active: device.isActive === 1,
      brand: device.brand,
      model: device.model,
      protocol: device.protocol,
      lastActive: new Date().toISOString()
    };
    this.devices = this.devices.map(item => String(item.id) === device.id ? updated : item);
    return of(this.mapToDevice(updated));
  }

  deleteDevice(id: string): Observable<boolean> {
    this.devices = this.devices.filter(item => String(item.id) !== id);
    return of(true);
  }

  toggleDevice(id: string): Observable<Device> {
    this.devices = this.devices.map(item => {
      if (String(item.id) !== id) return item;
      const nextActive = !(item.active ?? item.isActive);
      return {
        ...item,
        active: nextActive,
        isActive: nextActive,
        status: nextActive ? 'ON' : 'OFF',
        lastActive: new Date().toISOString()
      };
    });

    const device = this.devices.find(item => String(item.id) === id);
    return of(this.mapToDevice(device ?? this.devices[0]));
  }

  private mapToDevice(response: DeviceResponse): Device {
    const active = response.active ?? response.isActive ?? (response.status === 'ON');

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
