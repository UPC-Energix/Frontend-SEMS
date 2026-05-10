import { Injectable } from '@angular/core';
import { User } from '../../sems/iam/domain/model/entities/user.entity';
import { TokenService } from '../../sems/iam/infrastructure/services/token.service';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  constructor(private readonly tokenService: TokenService) {}

  get accessToken(): string | null {
    return this.tokenService.getAccessToken();
  }

  get refreshToken(): string | null {
    return this.tokenService.getRefreshToken();
  }

  get currentUser(): User | null {
    return this.tokenService.getUser();
  }

  get isAuthenticated(): boolean {
    return this.tokenService.hasValidToken();
  }

  clear(): void {
    this.tokenService.clearTokens();
  }
}

