import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { DevicesService } from '../../../application/services/devices.service';
import { Device, DeviceProtocol, DeviceStatus } from '../../../domain/model/device.entity';

@Component({
  selector: 'app-add-device',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './add-device.html',
  styleUrl: './add-device.css'
})
export class AddDevice {
  currentStep = 1;
  readonly totalSteps = 4;
  readonly deviceTypes = ['EOS', 'AIR_CONDITIONER', 'REFRIGERATOR', 'TV', 'MICROWAVE', 'LAPTOP', 'SMART_SPEAKER'];
  readonly protocols = [DeviceProtocol.WIFI, DeviceProtocol.BLUETOOTH];

  device: Partial<Device> = {
    id: '',
    name: '',
    category: '',
    type: '',
    brand: '',
    model: '',
    protocol: DeviceProtocol.WIFI,
    status: DeviceStatus.OFF,
    realTimeStatus: 'Off',
    lastActive: 'Now',
    location: '',
    isActive: 0
  };

  saving = false;
  error: string | null = null;

  constructor(
    private readonly devicesService: DevicesService,
    private readonly router: Router,
    private readonly translateService: TranslateService
  ) {}

  get isActive(): boolean {
    return this.device.isActive === 1;
  }

  set isActive(value: boolean) {
    this.device.isActive = value ? 1 : 0;
  }

  get titleText(): string {
    return this.translateService.instant('dashboard.devices.addDeviceTitle');
  }

  get saveText(): string {
    return this.translateService.instant('dashboard.devices.addDeviceSave');
  }

  get cancelText(): string {
    return this.translateService.instant('dashboard.devices.addDeviceCancel');
  }

  onCancel(): void {
    this.router.navigate(['/devices']);
  }

  nextStep(): void {
    if (!this.isCurrentStepValid()) {
      this.error = this.translateService.instant('dashboard.devices.addDeviceValidation');
      return;
    }

    this.error = null;
    this.currentStep = Math.min(this.currentStep + 1, this.totalSteps);
  }

  previousStep(): void {
    this.error = null;
    this.currentStep = Math.max(this.currentStep - 1, 1);
  }

  onSave(): void {
    if (!this.isFormValid()) {
      this.error = this.translateService.instant('dashboard.devices.addDeviceValidation');
      return;
    }

    this.saving = true;
    this.error = null;

    const newDevice: Device = {
      id: this.device.id && this.device.id.toString() || Date.now().toString(),
      name: this.device.name as string,
      category: this.device.category as string,
      type: (this.device.type as string) || 'UNKNOWN',
      brand: (this.device.brand as string) || '',
      model: (this.device.model as string) || '',
      protocol: this.device.protocol,
      status: (this.device.status as any) || 'OFF',
      realTimeStatus: (this.device.realTimeStatus as string) || 'Off',
      lastActive: (this.device.lastActive as string) || 'Now',
      location: (this.device.location as string) || '',
      isActive: this.device.isActive ? 1 : 0
    };

    this.devicesService.createDevice(newDevice).subscribe({
      next: () => {
        this.saving = false;
        this.router.navigate(['/devices']);
      },
      error: () => {
        this.saving = false;
        this.error = this.translateService.instant('dashboard.devices.addDeviceError');
      }
    });
  }

  private isCurrentStepValid(): boolean {
    if (this.currentStep === 1) return !!this.device.type;
    if (this.currentStep === 2) return !!this.device.protocol;
    if (this.currentStep === 3) return !!this.device.name && !!this.device.category && !!this.device.location;
    return true;
  }

  private isFormValid(): boolean {
    return !!this.device.type
      && !!this.device.protocol
      && !!this.device.name
      && !!this.device.category
      && !!this.device.location;
  }
}
