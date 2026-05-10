// src/app/sems/energy-management/application/state/settings.store.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SettingsResource } from '../../infrastructure/resources/settings.resource';

@Injectable({
  providedIn: 'root'
})
export class SettingsStore {
  private readonly settingsSubject = new BehaviorSubject<SettingsResource | null>(null);
  readonly settings$: Observable<SettingsResource | null> = this.settingsSubject.asObservable();

  updateActiveSettings(settings: SettingsResource | null): void {
    this.settingsSubject.next(settings);
  }

  clearActiveSettings(): void {
    this.settingsSubject.next(null);
  }

  get currentSettings(): SettingsResource | null {
    return this.settingsSubject.value;
  }
}
