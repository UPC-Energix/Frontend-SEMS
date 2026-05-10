import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthRepository } from '../../domain/model/repositories/auth.repository';
import { LoginCredentials } from '../../domain/model/value-objects/login-credentials.value-object';
import { TokenPair } from '../../domain/model/entities/token-pair.entity';
import { User } from '../../domain/model/entities/user.entity';
import { UserRepositoryImpl } from '../../infrastructure/repositories/user-repository';
import { TokenService } from '../../infrastructure/services/token.service';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly authRepository: AuthRepository;
  private readonly authStateSubject = new BehaviorSubject<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null
  });

  readonly authState$ = this.authStateSubject.asObservable();

  constructor(
    private readonly userRepository: UserRepositoryImpl,
    private readonly tokenService: TokenService
  ) {
    this.authRepository = this.userRepository;
    this.initializeAuthState();
  }

  login(username: string, password: string): Observable<{ user: User; tokens: TokenPair }> {
    this.updateAuthState({ ...this.authStateSubject.value, isLoading: true, error: null });

    return this.authRepository.login(new LoginCredentials(username, password)).pipe(
      tap(({ user, tokens }) => {
        this.persistAuthenticatedUser(user, tokens);
      }),
      catchError(error => {
        const errorMessage = this.getErrorMessage(error);
        this.updateAuthState({ ...this.authStateSubject.value, isLoading: false, error: errorMessage });
        return throwError(() => error);
      })
    );
  }

  register(command: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
    address: string;
  }): Observable<{ user: User; tokens: TokenPair }> {
    this.updateAuthState({ ...this.authStateSubject.value, isLoading: true, error: null });

    return this.authRepository.register(command).pipe(
      tap(({ user, tokens }) => {
        this.persistAuthenticatedUser(user, tokens);
      }),
      catchError(error => {
        const errorMessage = this.getErrorMessage(error, 'Error en el registro. Verifica tus datos.');
        this.updateAuthState({ ...this.authStateSubject.value, isLoading: false, error: errorMessage });
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  logout(): Observable<void> {
    const token = this.tokenService.getAccessToken();
    if (!token) {
      this.clearAuthState();
      return of(undefined);
    }

    return this.authRepository.logout(token).pipe(
      tap(() => this.clearAuthState()),
      catchError(() => {
        this.clearAuthState();
        return of(undefined);
      })
    );
  }

  refreshToken(): Observable<TokenPair> {
    const refreshToken = this.tokenService.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.authRepository.refreshToken(refreshToken).pipe(
      tap(tokens => this.tokenService.saveTokens(tokens)),
      catchError(error => {
        this.clearAuthState();
        return throwError(() => error);
      })
    );
  }

  validateToken(): Observable<boolean> {
    const token = this.tokenService.getAccessToken();
    if (!token) {
      return of(false);
    }

    return this.authRepository.validateToken(token).pipe(
      catchError(() => {
        this.clearAuthState();
        return of(false);
      })
    );
  }

  resetPassword(email: string): Observable<void> {
    this.updateAuthState({ ...this.authStateSubject.value, isLoading: true, error: null });

    return this.authRepository.resetPassword(email).pipe(
      tap(() => this.updateAuthState({ ...this.authStateSubject.value, isLoading: false, error: null })),
      catchError(error => {
        const errorMessage = this.getErrorMessage(error, 'No se pudo solicitar el cambio de contraseña.');
        this.updateAuthState({ ...this.authStateSubject.value, isLoading: false, error: errorMessage });
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  changePassword(oldPassword: string, newPassword: string): Observable<void> {
    const userId = this.getCurrentUser()?.id;
    if (!userId) {
      return throwError(() => new Error('No authenticated user'));
    }

    this.updateAuthState({ ...this.authStateSubject.value, isLoading: true, error: null });

    return this.authRepository.changePassword(userId, oldPassword, newPassword).pipe(
      tap(() => this.updateAuthState({ ...this.authStateSubject.value, isLoading: false, error: null })),
      catchError(error => {
        const errorMessage = this.getErrorMessage(error, 'No se pudo cambiar la contraseña.');
        this.updateAuthState({ ...this.authStateSubject.value, isLoading: false, error: errorMessage });
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  getCurrentUser(): User | null {
    return this.authStateSubject.value.user;
  }

  isAuthenticated(): boolean {
    return this.authStateSubject.value.isAuthenticated;
  }

  clearError(): void {
    this.updateAuthState({ ...this.authStateSubject.value, error: null });
  }

  updateCurrentUser(user: User): void {
    this.tokenService.saveUser(user);
    this.updateAuthState({
      user,
      isAuthenticated: true,
      isLoading: false,
      error: null
    });
  }

  private initializeAuthState(): void {
    const user = this.tokenService.getUser();
    const token = this.tokenService.getAccessToken();

    if (user && token && this.tokenService.hasValidToken()) {
      this.updateAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
    }
  }

  private persistAuthenticatedUser(user: User, tokens: TokenPair): void {
    this.tokenService.saveTokens(tokens);
    this.tokenService.saveUser(user);
    this.updateAuthState({
      user,
      isAuthenticated: true,
      isLoading: false,
      error: null
    });
  }

  private clearAuthState(): void {
    this.tokenService.clearTokens();
    this.updateAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null
    });
  }

  private updateAuthState(state: AuthState): void {
    this.authStateSubject.next(state);
  }

  private getErrorMessage(error: any, fallback = 'Ocurrió un error inesperado. Inténtalo nuevamente.'): string {
    if (error?.error?.message) return error.error.message;
    if (error?.error?.error) return error.error.error;
    if (typeof error?.error === 'string') return error.error;
    if (error?.message) return error.message;
    if (error?.status === 401) return 'Usuario o contraseña incorrectos.';
    if (error?.status === 0) return 'No se pudo conectar con el API Gateway.';

    return fallback;
  }
}
