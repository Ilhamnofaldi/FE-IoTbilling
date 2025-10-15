// Centralized API Client for better configuration and error handling

interface ApiConfig {
  baseURL: string;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
}

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  status?: number;
}

class ApiClient {
  private config: ApiConfig;

  constructor(config: ApiConfig) {
    this.config = config;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
    attempt: number = 1
  ): Promise<ApiResponse<T>> {
    const url = `${this.config.baseURL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
    const controller = new AbortController();

    console.log(`➡️ Final Request URL: ${url}`);
    
    // Set timeout
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, this.config.timeout);

    try {
      console.log(`🚀 API Request (Attempt ${attempt}/${this.config.retryAttempts}):`, {
        url,
        method: options.method || 'GET',
        headers: options.headers
      });

      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        success: true,
        data,
        status: response.status
      };

    } catch (error: any) {
      clearTimeout(timeoutId);
      
      console.error(`❌ API Request failed (Attempt ${attempt}):`, error);

      // Retry logic
      if (attempt < this.config.retryAttempts && this.shouldRetry(error)) {
        console.log(`🔄 Retrying in ${this.config.retryDelay * attempt}ms...`);
        
        await new Promise(resolve => 
          setTimeout(resolve, this.config.retryDelay * attempt)
        );
        
        return this.makeRequest<T>(endpoint, options, attempt + 1);
      }

      return {
        success: false,
        error: error.message || 'Network request failed',
        status: error.status
      };
    }
  }

  private shouldRetry(error: any): boolean {
    // Don't retry on authentication errors or client errors (4xx)
    if (error.status >= 400 && error.status < 500) {
      return false;
    }
    
    // Retry on network errors, timeouts, and server errors (5xx)
    return true;
  }

  async get<T>(endpoint: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'GET',
      headers
    });
  }

  async post<T>(endpoint: string, data?: any, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      body: data ? JSON.stringify(data) : undefined
    });
  }

  async patch<T>(endpoint: string, data?: any, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      body: data ? JSON.stringify(data) : undefined
    });
  }

  async delete<T>(endpoint: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'DELETE',
      headers
    });
  }
}

// Default configuration
const defaultConfig: ApiConfig = {
  baseURL: '', // Base URL dikosongkan untuk menggunakan proksi Vite
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000,
  retryAttempts: parseInt(import.meta.env.VITE_API_RETRY_ATTEMPTS) || 3,
  retryDelay: parseInt(import.meta.env.VITE_API_RETRY_DELAY) || 1000
};

// Export singleton instance
export const apiClient = new ApiClient(defaultConfig);
export type { ApiResponse };