import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { publicGuard } from './core/guards/public.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    canActivate: [publicGuard],
    children: [
      {
        path: 'login',
        loadComponent: () => import('./shared/presentation/layouts/layout-login/layout-login').then(m => m.LayoutLogin),
        children: [
          {
            path: '',
            loadComponent: () => import('./sems/iam/presentation/views/login/login').then(m => m.Login)
          }
        ]
      },
      {
        path: 'register',
        loadComponent: () => import('./shared/presentation/layouts/layout-login/layout-login').then(m => m.LayoutLogin),
        children: [
          {
            path: '',
            loadComponent: () => import('./sems/iam/presentation/views/register/register').then(m => m.Register)
          }
        ]
      }
    ]
  },
  {
    path: 'login',
    canActivate: [publicGuard],
    loadComponent: () => import('./shared/presentation/layouts/layout-login/layout-login').then(m => m.LayoutLogin),
    children: [
      {
        path: '',
        loadComponent: () => import('./sems/iam/presentation/views/login/login').then(m => m.Login)
      }
    ]
  },
  {
    path: 'register',
    canActivate: [publicGuard],
    loadComponent: () => import('./shared/presentation/layouts/layout-login/layout-login').then(m => m.LayoutLogin),
    children: [
      {
        path: '',
        loadComponent: () => import('./sems/iam/presentation/views/register/register').then(m => m.Register)
      }
    ]
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./shared/presentation/layouts/layout-home/layout-home').then(m => m.LayoutHome),
    children: [
      {
        path: 'home',
        loadComponent: () => import('./sems/energy-monitoring/presentation/views/home/home').then(m => m.Home)
      },
      {
        path: 'profile',
        loadComponent: () => import('./sems/iam/presentation/views/profile/profile').then(m => m.ProfileComponent)
      },
      {
        path: 'devices',
        loadComponent: () => import('./sems/device-management/presentation/views/devices/devices').then(m => m.Devices)
      },
      {
        path: 'devices/add',
        loadComponent: () => import('./sems/device-management/presentation/views/add-device/add-device').then(m => m.AddDevice)
      },
      {
        path: 'device-preferences',
        loadComponent: () => import('./sems/device-management/presentation/views/device-preferences/device-preferences').then(m => m.DevicePreferences)
      },
      {
        path: 'reports',
        loadComponent: () => import('./sems/analytics/presentation/views/reports/reports').then(m => m.Reports)
      },
      {
        path: 'settings',
        loadComponent: () => import('./sems/alerts/presentation/views/settings/settings').then(m => m.Settings)
      },
      {
        path: 'settings-suports',
        loadComponent: () => import('./sems/alerts/presentation/views/settings-suports/settings-suports').then(m => m.SettingsSuports)
      },
      {
        path: 'payments',
        loadComponent: () => import('./sems/billing/presentation/views/payments/payments').then(m => m.Payments)
      },
      {
        path: 'payment-success',
        loadComponent: () => import('./sems/billing/presentation/views/payment-success/payment-success').then(m => m.PaymentSuccess)
      },
      {
        path: 'payment-cancel',
        loadComponent: () => import('./sems/billing/presentation/views/payment-cancel/payment-cancel').then(m => m.PaymentCancel)
      }
    ]
  },
  {
    path: '**',
    loadComponent: () => import('./shared/presentation/views/page-not-found/page-not-found').then(m => m.PageNotFound)
  }
];
