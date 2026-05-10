import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SettingsRepository } from '../../domain/model/repositories/settings.repository';
import { SettingsResponse } from '../response/settings.response';
import { SettingsRequest } from '../request/settings.request';
import { apiGatewayUrl } from '../../../../core/config/api-gateway.config';
import { SavingRule } from '../resources/settings.resource';

@Injectable({
  providedIn: 'root'
})
export class SettingsRepositoryImpl implements SettingsRepository {
  private readonly settingsUrl = apiGatewayUrl('settings');
  private readonly alertsUrl = apiGatewayUrl('alerts');

  constructor(private http: HttpClient) { }

  getUserSettings(userId: string): Observable<SettingsResponse> {
    return this.http.get<SettingsResponse>(this.settingsUrl);
  }

  updateSettings(userId: string, request: SettingsRequest): Observable<SettingsResponse> {
    if (request.id) {
      return this.http.put<SettingsResponse>(this.settingsUrl, request);
    }

    return this.http.post<SettingsResponse>(this.settingsUrl, request);
  }

  createRule(rule: Partial<SavingRule>): Observable<SavingRule> {
    return this.http.post<SavingRule>(`${this.alertsUrl}/rules`, rule);
  }

  updateRule(ruleId: string, rule: Partial<SavingRule>): Observable<SavingRule> {
    return this.http.put<SavingRule>(`${this.alertsUrl}/rules/${ruleId}`, rule);
  }

  deleteRule(ruleId: string): Observable<void> {
    return this.http.delete<void>(`${this.alertsUrl}/rules/${ruleId}`);
  }

  resetToDefaults(userId: string): Observable<SettingsResponse> {
    return this.http.post<SettingsResponse>(`${this.settingsUrl}/reset`, {});
  }

  changePassword(userId: string, oldPassword: string, newPassword: string): Observable<void> {
    return this.http.post<void>(`${this.settingsUrl}/password`, {
      oldPassword,
      newPassword
    });
  }

  enableTwoFactor(userId: string): Observable<{ qrCode: string; secret: string }> {
    return this.http.post<{ qrCode: string; secret: string }>(
      `${this.settingsUrl}/2fa/enable`,
      {}
    );
  }
}
