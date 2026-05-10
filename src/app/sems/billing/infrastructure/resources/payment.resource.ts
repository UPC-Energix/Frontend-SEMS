import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiGatewayUrl } from '../../../../core/config/api-gateway.config';
import {
  CheckoutSessionResponse,
  PaymentResponse,
  PaymentHistoryResponse,
  PaymentIntentResponse
} from '../response/payment.response';
import {
  CreateCheckoutSessionRequest,
  CreatePaymentIntentRequest,
  ConfirmPaymentRequest
} from '../request/payment.request';

@Injectable({
  providedIn: 'root'
})
export class PaymentResource {
  private readonly billingUrl = apiGatewayUrl('billing');

  constructor(private readonly http: HttpClient) { }

  createCheckoutSession(request: CreateCheckoutSessionRequest): Observable<CheckoutSessionResponse> {
    return this.http.post<CheckoutSessionResponse>(
      `${this.billingUrl}/stripe/checkout-sessions`,
      request.toJson()
    );
  }

  getPaymentHistory(userId: string): Observable<PaymentHistoryResponse> {
    return this.http.get<PaymentHistoryResponse>(
      `${this.billingUrl}/payments/history/${userId}`
    );
  }

  getPaymentById(paymentId: string): Observable<PaymentResponse> {
    return this.http.get<PaymentResponse>(
      `${this.billingUrl}/payments/${paymentId}`
    );
  }

  createPaymentIntent(request: CreatePaymentIntentRequest): Observable<PaymentIntentResponse> {
    return this.http.post<PaymentIntentResponse>(
      `${this.billingUrl}/payments/intents`,
      request.toJson()
    );
  }

  confirmPayment(request: ConfirmPaymentRequest): Observable<any> {
    return this.http.post<any>(
      `${this.billingUrl}/payments/confirmations`,
      request.toJson()
    );
  }
}

