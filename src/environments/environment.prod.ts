export const environment = {
  production: true,
  apiGatewayUrl: 'https://api.sems.example.com/api',
  endpoints: {
    auth: '/iam',
    devices: '/devices',
    monitoring: '/monitoring',
    analytics: '/analytics',
    alerts: '/alerts',
    billing: '/billing',
    notifications: '/notifications',
    profiles: '/profiles',
    reports: '/reports',
    settings: '/settings'
  },
  tokenKey: 'sems_token',
  refreshTokenKey: 'sems_refresh_token',
  userKey: 'sems_user'
};
