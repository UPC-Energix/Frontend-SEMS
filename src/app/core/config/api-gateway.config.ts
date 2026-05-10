import { environment } from '../../../environments/environments';

export type ApiEndpointKey = keyof typeof environment.endpoints;

const trimRight = (value: string): string => value.replace(/\/+$/, '');
const trimLeft = (value: string): string => value.replace(/^\/+/, '');

export function apiGatewayBaseUrl(): string {
  return trimRight(environment.apiGatewayUrl);
}

export function apiGatewayUrl(endpoint: ApiEndpointKey, path = ''): string {
  const segment = environment.endpoints[endpoint];
  const normalizedPath = path ? `/${trimLeft(path)}` : '';

  return `${apiGatewayBaseUrl()}${segment}${normalizedPath}`;
}

