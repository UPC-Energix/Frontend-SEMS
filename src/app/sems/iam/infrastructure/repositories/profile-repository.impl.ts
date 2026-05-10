import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProfileRepository } from '../../domain/model/repositories/profile.repository';
import { ProfileResponse } from '../response/profile.response';
import { apiGatewayUrl } from '../../../../core/config/api-gateway.config';

@Injectable({
  providedIn: 'root'
})
export class ProfileRepositoryImpl implements ProfileRepository {
  private readonly profilesUrl = apiGatewayUrl('profiles');

  constructor(private http: HttpClient) {}

  loadProfile(userId: string): Observable<ProfileResponse> {
    return this.http.get<ProfileResponse>(`${this.profilesUrl}/me`);
  }

  updateProfile(userId: string, request: any): Observable<ProfileResponse> {
    return this.http.put<ProfileResponse>(`${this.profilesUrl}/me`, request);
  }
}
