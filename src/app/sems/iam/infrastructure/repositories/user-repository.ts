import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { apiGatewayUrl } from '../../../../core/config/api-gateway.config';
import { AuthRepository, UserRepository } from '../../domain/model/repositories/auth.repository';
import { LoginCredentials } from '../../domain/model/value-objects/login-credentials.value-object';
import { TokenPair } from '../../domain/model/entities/token-pair.entity';
import { User } from '../../domain/model/entities/user.entity';

export interface UserResponse {
  id: string | number;
  email: string;
  firstName?: string;
  name?: string;
  lastName?: string;
  role?: string;
  isActive?: boolean;
  createdAt?: string;
  lastLogin?: string;
  phone?: string;
  phoneNumber?: string;
  address?: string;
  profilePhotoUrl?: string;
}

export interface LoginResponse {
  user: UserResponse;
  accessToken?: string;
  access_token?: string;
  token?: string;
  refreshToken?: string;
  refresh_token?: string;
  expiresIn?: number;
  tokenType?: string;
}

export interface TokenResponse {
  accessToken?: string;
  access_token?: string;
  token?: string;
  refreshToken?: string;
  refresh_token?: string;
  expiresIn?: number;
  tokenType?: string;
}

export interface RegisterCommandDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  address: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserRepositoryImpl implements UserRepository, AuthRepository {
  private readonly iamUrl = apiGatewayUrl('auth');

  constructor(private readonly http: HttpClient) {}

  findByEmail(email: string): Observable<User | null> {
    return this.http.get<UserResponse>(`${this.iamUrl}/users/email/${email}`).pipe(
      map(response => this.mapToUser(response)),
      catchError(() => of(null))
    );
  }

  findById(id: string): Observable<User | null> {
    return this.http.get<UserResponse>(`${this.iamUrl}/users/${id}`).pipe(
      map(response => this.mapToUser(response)),
      catchError(() => of(null))
    );
  }

  findByUsername(username: string): Observable<User | null> {
    return this.http.get<UserResponse>(`${this.iamUrl}/users/username/${username}`).pipe(
      map(response => this.mapToUser(response)),
      catchError(() => of(null))
    );
  }

  save(user: User): Observable<User> {
    return this.http.put<UserResponse>(`${this.iamUrl}/users/${user.id}`, this.mapToUserResponse(user)).pipe(
      map(response => this.mapToUser(response))
    );
  }

  existsByEmail(email: string): Observable<boolean> {
    return this.http.get<{ exists: boolean }>(`${this.iamUrl}/users/email/${email}/exists`).pipe(
      map(response => response.exists),
      catchError(() => of(false))
    );
  }

  login(credentials: LoginCredentials): Observable<{ user: User; tokens: TokenPair }> {
    return this.http.post<LoginResponse>(`${this.iamUrl}/authentication/sign-in`, {
      email: credentials.username,
      password: credentials.password
    }).pipe(
      map(response => ({
        user: this.mapToUser(response.user),
        tokens: this.mapToTokenPair(response)
      }))
    );
  }

  register(command: RegisterCommandDto): Observable<{ user: User; tokens: TokenPair }> {
    const request = {
      email: command.email,
      password: command.password,
      name: command.firstName,
      firstName: command.firstName,
      lastName: command.lastName,
      phone: command.phoneNumber.replace(/\s+/g, ''),
      address: command.address
    };

    return this.http.post<LoginResponse | UserResponse>(`${this.iamUrl}/authentication/sign-up`, request).pipe(
      map(response => {
        const loginResponse = response as LoginResponse;
        if (!loginResponse.user || !this.extractAccessToken(loginResponse)) {
          throw new Error('Registration completed without login session');
        }

        return {
          user: this.mapToUser(loginResponse.user),
          tokens: this.mapToTokenPair(loginResponse)
        };
      }),
      catchError(error => {
        if (error?.message === 'Registration completed without login session') {
          return this.login(new LoginCredentials(command.email, command.password));
        }

        throw error;
      })
    );
  }

  logout(token: string): Observable<void> {
    return this.http.post<void>(`${this.iamUrl}/auth/logout`, { token });
  }

  refreshToken(refreshToken: string): Observable<TokenPair> {
    return this.http.post<TokenResponse>(`${this.iamUrl}/auth/refresh`, { refreshToken }).pipe(
      map(response => this.mapToTokenPair(response))
    );
  }

  validateToken(token: string): Observable<boolean> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<{ valid: boolean }>(`${this.iamUrl}/auth/validate`, { headers }).pipe(
      map(response => response.valid),
      catchError(() => of(false))
    );
  }

  resetPassword(email: string): Observable<void> {
    return this.http.post<void>(`${this.iamUrl}/auth/reset-password`, { email });
  }

  changePassword(userId: string, oldPassword: string, newPassword: string): Observable<void> {
    return this.http.put<void>(`${this.iamUrl}/users/${userId}/password`, {
      oldPassword,
      newPassword
    });
  }

  private mapToUser(response: UserResponse): User {
    return new User(
      response.id.toString(),
      response.email,
      response.firstName || response.name || 'User',
      response.lastName || '',
      response.role || 'USER',
      response.isActive ?? true,
      new Date(response.createdAt || new Date()),
      response.lastLogin ? new Date(response.lastLogin) : undefined,
      undefined,
      response.phoneNumber || response.phone,
      response.address,
      response.profilePhotoUrl
    );
  }

  private mapToUserResponse(user: User): UserResponse {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt.toISOString(),
      lastLogin: user.lastLogin?.toISOString(),
      phoneNumber: user.phoneNumber,
      address: user.address,
      profilePhotoUrl: user.profilePhotoUrl
    };
  }

  private mapToTokenPair(response: LoginResponse | TokenResponse): TokenPair {
    const accessToken = this.extractAccessToken(response);
    if (!accessToken) {
      throw new Error('Access token was not returned by IAM Service');
    }

    return new TokenPair(
      accessToken,
      response.refreshToken || response.refresh_token || undefined,
      response.expiresIn || 3600,
      response.tokenType || 'Bearer'
    );
  }

  private extractAccessToken(response: LoginResponse | TokenResponse): string | undefined {
    return response.accessToken || response.access_token || response.token;
  }
}
