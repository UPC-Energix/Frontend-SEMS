import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
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
  constructor(private readonly http: HttpClient) {}

  findByEmail(email: string): Observable<User | null> {
    return of(this.mockUser({ email }));
  }

  findById(id: string): Observable<User | null> {
    return of(this.mockUser({ id }));
  }

  findByUsername(username: string): Observable<User | null> {
    return of(this.mockUser({ email: username }));
  }

  save(user: User): Observable<User> {
    return of(user);
  }

  existsByEmail(email: string): Observable<boolean> {
    return of(false);
  }

  login(credentials: LoginCredentials): Observable<{ user: User; tokens: TokenPair }> {
    return of({
      user: this.mockUser({ email: credentials.username }),
      tokens: this.mockTokenPair()
    });
  }

  register(command: RegisterCommandDto): Observable<{ user: User; tokens: TokenPair }> {
    return of({
      user: this.mockUser({
        email: command.email,
        firstName: command.firstName,
        lastName: command.lastName,
        phoneNumber: command.phoneNumber,
        address: command.address
      }),
      tokens: this.mockTokenPair()
    });
  }

  logout(token: string): Observable<void> {
    return of(undefined);
  }

  refreshToken(refreshToken: string): Observable<TokenPair> {
    return of(this.mockTokenPair());
  }

  validateToken(token: string): Observable<boolean> {
    return of(true);
  }

  resetPassword(email: string): Observable<void> {
    return of(undefined);
  }

  changePassword(userId: string, oldPassword: string, newPassword: string): Observable<void> {
    return of(undefined);
  }

  private mockUser(overrides: Partial<UserResponse> = {}): User {
    return this.mapToUser({
      id: overrides.id ?? 1,
      email: overrides.email ?? 'demo@sems.app',
      firstName: overrides.firstName ?? 'Usuario',
      lastName: overrides.lastName ?? 'Demo',
      role: overrides.role ?? 'USER',
      isActive: overrides.isActive ?? true,
      createdAt: overrides.createdAt ?? new Date().toISOString(),
      lastLogin: overrides.lastLogin ?? new Date().toISOString(),
      phoneNumber: overrides.phoneNumber ?? '999999999',
      address: overrides.address ?? 'Lima, Peru',
      profilePhotoUrl: overrides.profilePhotoUrl
    });
  }

  private mockTokenPair(): TokenPair {
    return new TokenPair('mock-access-token', 'mock-refresh-token', 86400, 'Bearer');
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
