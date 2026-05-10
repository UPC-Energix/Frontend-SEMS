import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ProfileRepository } from '../../domain/model/repositories/profile.repository';
import { ProfileResponse } from '../response/profile.response';

@Injectable({
  providedIn: 'root'
})
export class ProfileRepositoryImpl implements ProfileRepository {
  private profile: ProfileResponse = {
    id: 1,
    email: 'demo@sems.app',
    firstName: 'Usuario',
    lastName: 'Demo',
    phone: '999999999',
    address: 'Lima, Peru',
    profilePhotoUrl: null
  };

  constructor(private http: HttpClient) {}

  loadProfile(userId: string): Observable<ProfileResponse> {
    return of(this.profile);
  }

  updateProfile(userId: string, request: any): Observable<ProfileResponse> {
    this.profile = { ...this.profile, ...request };
    return of(this.profile);
  }
}
