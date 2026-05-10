import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { SettingsRepository } from '../../domain/model/repositories/settings.repository';
import { SettingsResponse } from '../response/settings.response';
import { SettingsRequest } from '../request/settings.request';
import { SavingRule } from '../resources/settings.resource';

@Injectable({
  providedIn: 'root'
})
export class SettingsRepositoryImpl implements SettingsRepository {
  private settings: SettingsResponse = {
    id: 1,
    userId: 1,
    notificationsEnabled: true,
    highConsumptionAlerts: true,
    dailyWeeklySummary: true,
    notificationScheduleStart: '08:00',
    notificationScheduleEnd: '21:00',
    reportDaily: false,
    reportWeekly: true,
    reportMonthly: true,
    reportFormatPdf: true,
    reportFormatCsv: true,
    twoFactorEnabled: false,
    lastPasswordChange: new Date().toISOString(),
    savingRules: [
      { id: 1, name: 'Apagar luces inactivas', isEnabled: true },
      { id: 2, name: 'Reducir consumo en horas pico', isEnabled: true }
    ]
  };

  constructor(private http: HttpClient) { }

  getUserSettings(userId: string): Observable<SettingsResponse> {
    return of(this.settings);
  }

  updateSettings(userId: string, request: SettingsRequest): Observable<SettingsResponse> {
    this.settings = {
      ...this.settings,
      id: request.id ?? this.settings.id,
      userId: request.userId ?? this.settings.userId,
      notificationsEnabled: request.notificationsEnabled ?? this.settings.notificationsEnabled,
      highConsumptionAlerts: request.highConsumptionAlerts ?? this.settings.highConsumptionAlerts,
      dailyWeeklySummary: request.dailyWeeklySummary ?? this.settings.dailyWeeklySummary,
      notificationScheduleStart: request.notificationScheduleStart ?? this.settings.notificationScheduleStart,
      notificationScheduleEnd: request.notificationScheduleEnd ?? this.settings.notificationScheduleEnd,
      reportDaily: request.reportDaily ?? this.settings.reportDaily,
      reportWeekly: request.reportWeekly ?? this.settings.reportWeekly,
      reportMonthly: request.reportMonthly ?? this.settings.reportMonthly,
      reportFormatPdf: request.reportFormatPdf ?? this.settings.reportFormatPdf,
      reportFormatCsv: request.reportFormatCsv ?? this.settings.reportFormatCsv,
      twoFactorEnabled: request.twoFactorEnabled ?? this.settings.twoFactorEnabled,
      lastPasswordChange: request.lastPasswordChange ?? this.settings.lastPasswordChange
    };
    return of(this.settings);
  }

  createRule(rule: Partial<SavingRule>): Observable<SavingRule> {
    const newRule: SavingRule = {
      id: Date.now(),
      name: rule.name ?? 'Nueva regla',
      isEnabled: rule.isEnabled ?? true
    };
    this.settings = {
      ...this.settings,
      savingRules: [...(this.settings.savingRules ?? []), newRule]
    };
    return of(newRule);
  }

  updateRule(ruleId: string, rule: Partial<SavingRule>): Observable<SavingRule> {
    const updatedRule: SavingRule = {
      id: Number(ruleId),
      name: rule.name ?? 'Regla de ahorro',
      isEnabled: rule.isEnabled ?? true
    };
    this.settings = {
      ...this.settings,
      savingRules: (this.settings.savingRules ?? []).map(item =>
        String(item.id) === ruleId ? updatedRule : item
      )
    };
    return of(updatedRule);
  }

  deleteRule(ruleId: string): Observable<void> {
    this.settings = {
      ...this.settings,
      savingRules: (this.settings.savingRules ?? []).filter(item => String(item.id) !== ruleId)
    };
    return of(undefined);
  }

  resetToDefaults(userId: string): Observable<SettingsResponse> {
    return of(this.settings);
  }

  changePassword(userId: string, oldPassword: string, newPassword: string): Observable<void> {
    this.settings = {
      ...this.settings,
      lastPasswordChange: new Date().toISOString()
    };
    return of(undefined);
  }

  enableTwoFactor(userId: string): Observable<{ qrCode: string; secret: string }> {
    this.settings = { ...this.settings, twoFactorEnabled: true };
    return of({ qrCode: 'mock-qr-code', secret: 'MOCK-SECRET' });
  }
}
