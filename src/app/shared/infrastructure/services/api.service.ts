import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

type ApiEndpointKey = string;

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private readonly http: HttpClient) {}

  get<T>(endpoint: ApiEndpointKey, path = ''): Observable<T> {
    return this.http.get<T>(this.buildUrl(endpoint, path));
  }

  post<T>(endpoint: ApiEndpointKey, path: string, data: unknown): Observable<T> {
    return this.http.post<T>(this.buildUrl(endpoint, path), data);
  }

  put<T>(endpoint: ApiEndpointKey, path: string, data: unknown): Observable<T> {
    return this.http.put<T>(this.buildUrl(endpoint, path), data);
  }

  delete<T>(endpoint: ApiEndpointKey, path: string): Observable<T> {
    return this.http.delete<T>(this.buildUrl(endpoint, path));
  }

  private buildUrl(endpoint: ApiEndpointKey, path = ''): string {
    const normalizedPath = path ? `/${path.replace(/^\/+/, '')}` : '';
    return `/${endpoint.replace(/^\/+|\/+$/g, '')}${normalizedPath}`;
  }
}
