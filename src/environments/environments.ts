export const environment = {
  production: false,
  apiGatewayUrl: 'http://localhost:8080/api',
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
