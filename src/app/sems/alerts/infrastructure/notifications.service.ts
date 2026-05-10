import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { apiGatewayUrl } from '../../../core/config/api-gateway.config';
import { TokenService } from '../../iam/infrastructure/services/token.service';
import { NotificationEntity } from '../domain/model/notifications.entity';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly notificationsUrl = apiGatewayUrl('notifications');

  constructor(
    private readonly http: HttpClient,
    private readonly tokenService: TokenService
  ) {}

  getNotifications(): Observable<NotificationEntity[]> {
    const currentUser = this.tokenService.getUser();
    let params = new HttpParams();

    if (currentUser?.id) {
      params = params.set('userId', currentUser.id);
    }

    return this.http.get<any[]>(this.notificationsUrl, { params }).pipe(
      map(items => (Array.isArray(items) ? items : []).map(item => this.mapToNotification(item))),
      catchError(() => of([]))
    );
  }

  markAsRead(notification: NotificationEntity): Observable<NotificationEntity> {
    const id = encodeURIComponent(String((notification as any).id));
    return this.http.put<NotificationEntity>(`${this.notificationsUrl}/${id}/read`, {});
  }

  private mapToNotification(item: any): NotificationEntity {
    const message = item.message ?? item.msg ?? '';
    const i18nInfo = this.mapMessageToI18n(message);

    return {
      id: item.notificationId ?? item.notification_id ?? item.id ?? 0,
      title: item.title ?? item.subject ?? '',
      message,
      messageKey: i18nInfo.key,
      messageParams: i18nInfo.params,
      type: item.type ?? item.severity ?? 'info',
      timestamp: item.timestamp ?? item.createdAt ?? item.created_at ?? '',
      isRead: !!(item.isRead || item.read || item.read_at)
    } as NotificationEntity;
  }

  private mapMessageToI18n(rawMessage: string): { key?: string; params?: Record<string, string> } {
    const lower = rawMessage.toLowerCase();

    if (lower.includes('mantenimiento')) return { key: 'notifications.messages.maintenance' };
    if (lower.includes('encendida')) return { key: 'notifications.messages.uptime_warning' };
    if (lower.includes('actualizado')) return { key: 'notifications.messages.updated' };
    if (lower.includes('optimizado') || lower.includes('ahorrando')) {
      const percent = rawMessage.match(/(\d+)%/)?.[1] || '';
      return { key: 'notifications.messages.optimized', params: { percent } };
    }
    if (lower.includes('pico')) {
      const percent = rawMessage.match(/(\d+)%/)?.[1] || '';
      return { key: 'notifications.messages.usage_spike', params: { percent } };
    }

    return {};
  }
}
