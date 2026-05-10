import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Device } from '../../../domain/model/device.entity';
import { DevicesService } from '../../../application/services/devices.service';
import { AuthControllerService } from '../../../../iam/application/services/auth-controller.service';

@Component({
  selector: 'app-devices',
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './devices.html',
  styleUrl: './devices.css'
})
export class Devices implements OnInit, OnDestroy {
  devices: Device[] = [];
  loading = true;
  error: string | null = null;
  searchTerm = '';
  statusFilter = 'all';
  categoryFilter = 'all';
  locationFilter = 'all';

  private destroy$ = new Subject<void>();

  constructor(
    private readonly devicesService: DevicesService,
    private readonly translateService: TranslateService,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef,
    private readonly authController: AuthControllerService
  ) { }

  ngOnInit(): void {
    if (!this.authController.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    this.cdr.detectChanges();
    this.loadDevices();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadDevices(): void {
    this.loading = true;
    this.error = null;

    this.devicesService.getAllDevices()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: devices => {
          this.devices = devices;
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.error = this.translateService.instant('dashboard.devices.loadError');
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
  }

  // Getters para las traducciones
  get myDevicesText(): string {
    return this.translateService.instant('dashboard.devices.myDevices');
  }

  get preferencesText(): string {
    return this.translateService.instant('dashboard.devices.preferences');
  }

  get addDeviceText(): string {
    return this.translateService.instant('dashboard.devices.addDevice');
  }

  get realTimeStatusText(): string {
    return this.translateService.instant('dashboard.devices.realTimeStatus');
  }

  get lastActiveText(): string {
    return this.translateService.instant('dashboard.devices.lastActive');
  }

  get alertHistoryText(): string {
    return this.translateService.instant('dashboard.devices.alertHistory');
  }

  get energyConsumptionText(): string {
    return this.translateService.instant('dashboard.devices.energyConsumption');
  }

  get noDevicesText(): string {
    return this.translateService.instant('dashboard.devices.noDevices');
  }

  get filteredDevices(): Device[] {
    const search = this.searchTerm.trim().toLowerCase();

    return this.devices.filter(device => {
      const matchesSearch = !search || [
        device.name,
        device.type,
        device.category,
        device.location
      ].some(value => value?.toLowerCase().includes(search));

      const matchesStatus = this.statusFilter === 'all' || device.status === this.statusFilter;
      const matchesCategory = this.categoryFilter === 'all' || device.category === this.categoryFilter;
      const matchesLocation = this.locationFilter === 'all' || device.location === this.locationFilter;

      return matchesSearch && matchesStatus && matchesCategory && matchesLocation;
    });
  }

  get categories(): string[] {
    return [...new Set(this.devices.map(device => device.category).filter(Boolean))];
  }

  get locations(): string[] {
    return [...new Set(this.devices.map(device => device.location).filter(Boolean))];
  }

  getStatusText(status: string): string {
    if (!status) {
      return 'N/A';
    }

    switch (status.toLowerCase()) {
      case 'on':
        return this.translateService.instant('dashboard.devices.status.on');
      case 'off':
        return this.translateService.instant('dashboard.devices.status.off');
      case 'standby':
        return this.translateService.instant('dashboard.devices.status.standby');
      case 'charging':
        return this.translateService.instant('dashboard.devices.status.charging');
      default:
        return status;
    }
  }

  getCategoryText(category: string): string {
    if (!category) {
      return 'N/A';
    }

    const categoryKey = category.toLowerCase()
      .replace(/\s*&\s*/g, '_')
      .replace(/\s+/g, '_');

    const translationKey = `dashboard.devices.categories.${categoryKey}`;
    const translated = this.translateService.instant(translationKey);

    return translated !== translationKey ? translated : category;
  }

  getAlertText(alert: string): string {
    if (alert.toLowerCase().includes('no alert')) {
      return this.translateService.instant('dashboard.devices.alerts.noAlerts');
    }
    if (alert.toLowerCase().includes('phantom load')) {
      return this.translateService.instant('dashboard.devices.alerts.phantomLoad');
    }
    return alert;
  }

  goToPreferences(): void {
    this.router.navigate(['/device-preferences']);
  }

  goToAddDevice(): void {
    this.router.navigate(['/devices/add']);
  }

  deleteDevice(deviceId: string, deviceName: string): void {
    const confirmed = confirm(
      this.translateService.instant('dashboard.devices.deleteConfirmation', { name: deviceName })
    );

    if (confirmed) {
      if (!this.authController.isAuthenticated()) {
        this.router.navigate(['/login']);
        return;
      }

      this.devicesService.deleteDevice(deviceId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (success: boolean) => {
            if (success) {
              this.loadDevices();
            } else {
              alert(this.translateService.instant('dashboard.devices.deleteError'));
            }
          },
          error: (error: any) => {
            if (error.status === 401) {
              alert('No tienes permisos suficientes para eliminar este dispositivo. Contacta al administrador.');
            } else {
              alert(this.translateService.instant('dashboard.devices.deleteError'));
            }
          }
        });
    }
  }
}
