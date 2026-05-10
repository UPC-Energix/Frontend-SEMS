import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environments';
import { TokenPair } from '../../domain/model/entities/token-pair.entity';
import { User } from '../../domain/model/entities/user.entity';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private readonly TOKEN_KEY = environment.tokenKey;
  private readonly REFRESH_TOKEN_KEY = environment.refreshTokenKey;
  private readonly USER_KEY = environment.userKey;

  saveTokens(tokens: TokenPair): void {
    if (!this.hasStorage()) return;

    localStorage.setItem(this.TOKEN_KEY, tokens.accessToken);

    if (tokens.refreshToken) {
      localStorage.setItem(this.REFRESH_TOKEN_KEY, tokens.refreshToken);
    } else {
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    }

    localStorage.setItem(`${this.TOKEN_KEY}_expires`, tokens.getExpirationDate().toISOString());
  }

  getAccessToken(): string | null {
    return this.hasStorage() ? localStorage.getItem(this.TOKEN_KEY) : null;
  }

  getRefreshToken(): string | null {
    return this.hasStorage() ? localStorage.getItem(this.REFRESH_TOKEN_KEY) : null;
  }

  getTokenPair(): TokenPair | null {
    if (!this.hasStorage()) return null;

    const accessToken = this.getAccessToken();
    const refreshToken = this.getRefreshToken();
    const expiresAt = localStorage.getItem(`${this.TOKEN_KEY}_expires`);

    if (!accessToken || !expiresAt) return null;

    const expiresIn = Math.max(
      0,
      Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000)
    );

    return new TokenPair(accessToken, refreshToken || undefined, expiresIn);
  }

  isTokenExpired(): boolean {
    if (!this.hasStorage()) return true;

    const expiresAt = localStorage.getItem(`${this.TOKEN_KEY}_expires`);
    return !expiresAt || Date.now() >= new Date(expiresAt).getTime();
  }

  saveUser(user: User): void {
    if (!this.hasStorage()) return;

    localStorage.setItem(this.USER_KEY, JSON.stringify({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      phoneNumber: user.phoneNumber,
      address: user.address,
      profilePhotoUrl: user.profilePhotoUrl,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt.toISOString(),
      lastLogin: user.lastLogin?.toISOString()
    }));
  }

  getUser(): User | null {
    if (!this.hasStorage()) return null;

    const userData = localStorage.getItem(this.USER_KEY);
    if (!userData) return null;

    try {
      const parsed = JSON.parse(userData);
      return new User(
        parsed.id,
        parsed.email,
        parsed.firstName,
        parsed.lastName,
        parsed.role,
        parsed.isActive,
        new Date(parsed.createdAt),
        parsed.lastLogin ? new Date(parsed.lastLogin) : undefined,
        parsed.username,
        parsed.phoneNumber,
        parsed.address,
        parsed.profilePhotoUrl
      );
    } catch {
      this.clearTokens();
      return null;
    }
  }

  clearTokens(): void {
    if (!this.hasStorage()) return;

    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(`${this.TOKEN_KEY}_expires`);
    localStorage.removeItem(this.USER_KEY);
  }

  hasValidToken(): boolean {
    return !!this.getAccessToken() && !this.isTokenExpired();
  }

  getAuthorizationHeader(): string | null {
    const token = this.getAccessToken();
    return token ? `Bearer ${token}` : null;
  }

  private hasStorage(): boolean {
    return typeof window !== 'undefined' && !!window.localStorage;
  }
}
