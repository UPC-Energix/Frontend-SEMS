import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { DevicePreference } from '../../domain/model/entities/device-preference.entity';
import { PreferenceSettings } from '../../domain/model/entities/device-preference.entity';
import { DevicePreferenceRepository } from '../../domain/model/repositories/device-preference.repository';
import { DevicePreferenceResponse, DevicePreferenceRequest } from '../response/device-preference.response';
import { apiGatewayUrl } from '../../../../core/config/api-gateway.config';

@Injectable({
  providedIn: 'root'
})
export class DevicePreferenceRepositoryImpl implements DevicePreferenceRepository {
  private readonly devicesUrl = apiGatewayUrl('devices');

  constructor(private readonly http: HttpClient) { }

  getDevicePreferences(userId: string): Observable<DevicePreference> {
    const url = `${this.devicesUrl}/preferences`;

    return this.http.get<DevicePreferenceResponse>(url)
      .pipe(
        map(response => this.mapToDevicePreference(response)),
        catchError(() => {
          return of(this.getDefaultPreferences(userId));
        })
      );
  }

  updateDevicePreferences(preferences: DevicePreference): Observable<DevicePreference> {
    const url = `${this.devicesUrl}/preferences`;
    const requestBody: DevicePreferenceRequest = this.mapToDevicePreferenceRequest(preferences);

    return this.http.put<DevicePreferenceResponse>(url, requestBody.preferences)
      .pipe(
        map(response => this.mapToDevicePreference(response)),
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  private mapToDevicePreference(response: DevicePreferenceResponse): DevicePreference {
    // La API puede devolver las preferencias de dos formas:
    // 1. Dentro de un campo "preferences": { preferences: { habilitarMonitoreoEnergia: true, ... } }
    // 2. Directly in the root object: { habilitarMonitoreoEnergia: true, ... }
    const apiPrefs = response.preferences || response;

    const internal: PreferenceSettings = {
      enableEnergyMonitoring: this.coalesceApi(apiPrefs, ['enableEnergyMonitoring', 'habilitarMonitoreoEnergia']),
      receiveHighUsageAlerts: this.coalesceApi(apiPrefs, ['receiveHighUsageAlerts', 'recibirAlertasAltoConsumo']),
      monitorHeatingCooling: this.coalesceApi(apiPrefs, ['monitorHeatingCooling', 'monitorearCalefaccionRefrigeracion']),
      monitorMajorAppliances: this.coalesceApi(apiPrefs, ['monitorMajorAppliances', 'monitorearElectrodomesticosPrincipales']),
      monitorElectronics: this.coalesceApi(apiPrefs, ['monitorElectronics', 'monitorearElectronicos']),
      monitorKitchenDevices: this.coalesceApi(apiPrefs, ['monitorKitchenDevices', 'monitorearDispositivosCocina']),
      includeOutdoorLighting: this.coalesceApi(apiPrefs, ['includeOutdoorLighting', 'incluirIluminacionExterior']),
      trackStandbyPower: this.coalesceApi(apiPrefs, ['trackStandbyPower', 'rastrearEnergiaEspera']),
      dailySummaryEmails: this.coalesceApi(apiPrefs, ['dailySummaryEmails', 'emailsResumenDiario']),
      weeklyProgressReports: this.coalesceApi(apiPrefs, ['weeklyProgressReports', 'reportesProgresoSemanal']),
      suggestSavingAutomations: this.coalesceApi(apiPrefs, ['suggestSavingAutomations', 'sugerirAutomatizacionesAhorro']),
      alertsForUnpluggedDevices: this.coalesceApi(apiPrefs, ['alertsForUnpluggedDevices', 'alertasDispositivosDesconectados'])
    };


    return {
      id: response.id?.toString() ?? '1',
      userId: response.userId ?? '',
      preferences: internal,
      lastUpdated: response.lastUpdated ?? new Date().toISOString()
    };
  }

  private coalesceApi(obj: any, keys: string[]): boolean {
    for (const k of keys) {
      if (obj && typeof obj[k] !== 'undefined') {
        return !!obj[k];
      }
    }
    return false;
  }

  private mapToDevicePreferenceRequest(preferences: DevicePreference): DevicePreferenceRequest {
    const prefs = preferences.preferences || ({} as PreferenceSettings);

    // Map internal english keys -> API spanish keys
    const mappedPrefs: any = {
      habilitarMonitoreoEnergia: !!prefs.enableEnergyMonitoring,
      recibirAlertasAltoConsumo: !!prefs.receiveHighUsageAlerts,
      monitorearCalefaccionRefrigeracion: !!prefs.monitorHeatingCooling,
      monitorearElectrodomesticosPrincipales: !!prefs.monitorMajorAppliances,
      monitorearElectronicos: !!prefs.monitorElectronics,
      monitorearDispositivosCocina: !!prefs.monitorKitchenDevices,
      incluirIluminacionExterior: !!prefs.includeOutdoorLighting,
      rastrearEnergiaEspera: !!prefs.trackStandbyPower,
      emailsResumenDiario: !!prefs.dailySummaryEmails,
      reportesProgresoSemanal: !!prefs.weeklyProgressReports,
      sugerirAutomatizacionesAhorro: !!prefs.suggestSavingAutomations,
      alertasDispositivosDesconectados: !!prefs.alertsForUnpluggedDevices
    };

    return {
      userId: preferences.userId,
      preferences: mappedPrefs
    };
  }

  private getDefaultPreferences(userId: string): DevicePreference {
    return {
      id: '1',
      userId: userId,
      preferences: {
        enableEnergyMonitoring: true,
        receiveHighUsageAlerts: true,
        monitorHeatingCooling: true,
        monitorMajorAppliances: true,
        monitorElectronics: true,
        monitorKitchenDevices: false,
        includeOutdoorLighting: true,
        trackStandbyPower: true,
        dailySummaryEmails: false,
        weeklyProgressReports: true,
        suggestSavingAutomations: true,
        alertsForUnpluggedDevices: true
      },
      lastUpdated: new Date().toISOString()
    };
  }
}

