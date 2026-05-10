import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiEndpointKey, apiGatewayUrl } from '../../../core/config/api-gateway.config';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private readonly http: HttpClient) {}

  get<T>(endpoint: ApiEndpointKey, path = ''): Observable<T> {
    return this.http.get<T>(apiGatewayUrl(endpoint, path));
  }

  post<T>(endpoint: ApiEndpointKey, path: string, data: unknown): Observable<T> {
    return this.http.post<T>(apiGatewayUrl(endpoint, path), data);
  }

  put<T>(endpoint: ApiEndpointKey, path: string, data: unknown): Observable<T> {
    return this.http.put<T>(apiGatewayUrl(endpoint, path), data);
  }

  delete<T>(endpoint: ApiEndpointKey, path: string): Observable<T> {
    return this.http.delete<T>(apiGatewayUrl(endpoint, path));
  }
}
