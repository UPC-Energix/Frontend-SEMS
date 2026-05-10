// src/app/sems/energy-management/domain/model/repositories/settings.repository.ts
import { Observable } from 'rxjs';
import { SettingsResponse } from '../../../infrastructure/response/settings.response';
import { SettingsRequest } from '../../../infrastructure/request/settings.request';

export interface SettingsRepository {
  getUserSettings(userId: string): Observable<SettingsResponse>;
  updateSettings(userId: string, request: SettingsRequest): Observable<SettingsResponse>;
  resetToDefaults(userId: string): Observable<SettingsResponse>;
  changePassword(userId: string, oldPassword: string, newPassword: string): Observable<void>;
  enableTwoFactor(userId: string): Observable<{ qrCode: string; secret: string }>;
}
