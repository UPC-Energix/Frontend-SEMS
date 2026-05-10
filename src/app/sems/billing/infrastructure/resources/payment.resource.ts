import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
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
  constructor(private readonly http: HttpClient) { }

  createCheckoutSession(request: CreateCheckoutSessionRequest): Observable<CheckoutSessionResponse> {
    const body = request.toJson() as { amount?: number };
    return of({
      id: `checkout-${Date.now()}`,
      url: '/payment-success',
      amount: body.amount ?? 0
    });
  }

  getPaymentHistory(userId: string): Observable<PaymentHistoryResponse> {
    return of({
      payments: [
        {
          id: 'pay-1',
          userId,
          amount: 49.9,
          currency: 'USD',
          status: 'paid',
          paymentIntentId: 'pi_mock',
          description: 'Plan SEMS',
          createdAt: new Date().toISOString()
        }
      ]
    });
  }

  getPaymentById(paymentId: string): Observable<PaymentResponse> {
    return of({
      id: paymentId,
      userId: '1',
      amount: 49.9,
      currency: 'USD',
      status: 'paid',
      paymentIntentId: 'pi_mock',
      description: 'Plan SEMS',
      createdAt: new Date().toISOString()
    });
  }

  createPaymentIntent(request: CreatePaymentIntentRequest): Observable<PaymentIntentResponse> {
    return of({
      clientSecret: 'mock-client-secret',
      paymentIntentId: `pi-${Date.now()}`
    });
  }

  confirmPayment(request: ConfirmPaymentRequest): Observable<any> {
    return of({ success: true });
  }
}

