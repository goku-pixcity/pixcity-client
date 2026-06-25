export interface ApiResponse<T = unknown> {
  data: T;
  success: boolean;
  code: number;
}

export function maybeRefreshToken(): Promise<void>;
export function apiRequest<T = unknown>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>>;
export function apiRequestWithAuth<T = unknown>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>>;
