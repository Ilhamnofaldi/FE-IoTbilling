// Error handling utilities for better user experience

export enum ErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

export interface AppError {
  type: ErrorType;
  message: string;
  userMessage: string;
  details?: any;
}

export class ErrorHandler {
  static categorizeError(error: any): AppError {
    // Network errors (including CORS)
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      return {
        type: ErrorType.NETWORK_ERROR,
        message: 'CORS or Network Error: ' + error.message,
        userMessage: 'Gagal terhubung ke server. Ini kemungkinan disebabkan oleh masalah CORS atau jaringan. Pastikan server mengizinkan permintaan dari origin Anda.',
        details: error
      };
    }

    // Timeout errors
    if (error.name === 'AbortError' || error.message?.includes('timeout')) {
      return {
        type: ErrorType.TIMEOUT_ERROR,
        message: error.message,
        userMessage: 'Permintaan memakan waktu terlalu lama. Silakan coba lagi.',
        details: error
      };
    }

    // Authentication errors
    if (error.status === 401 || error.status === 403) {
      return {
        type: ErrorType.AUTHENTICATION_ERROR,
        message: error.message,
        userMessage: 'Sesi Anda telah berakhir. Silakan login kembali.',
        details: error
      };
    }

    // Validation errors
    if (error.status >= 400 && error.status < 500) {
      return {
        type: ErrorType.VALIDATION_ERROR,
        message: error.message,
        userMessage: 'Data yang dikirim tidak valid. Periksa kembali input Anda.',
        details: error
      };
    }

    // Server errors
    if (error.status >= 500) {
      return {
        type: ErrorType.SERVER_ERROR,
        message: error.message,
        userMessage: 'Terjadi kesalahan pada server. Silakan coba lagi nanti.',
        details: error
      };
    }

    // Unknown errors
    return {
      type: ErrorType.UNKNOWN_ERROR,
      message: error.message || 'Unknown error occurred',
      userMessage: 'Terjadi kesalahan yang tidak diketahui. Silakan coba lagi.',
      details: error
    };
  }

  static shouldRetry(error: AppError): boolean {
    return [
      ErrorType.NETWORK_ERROR,
      ErrorType.TIMEOUT_ERROR,
      ErrorType.SERVER_ERROR
    ].includes(error.type);
  }

  static shouldShowOptimisticUpdate(error: AppError): boolean {
    return [
      ErrorType.NETWORK_ERROR,
      ErrorType.TIMEOUT_ERROR
    ].includes(error.type);
  }

  static getRetryDelay(attempt: number): number {
    // Exponential backoff with jitter
    const baseDelay = 1000; // 1 second
    const exponentialDelay = Math.pow(2, attempt - 1) * baseDelay;
    const jitter = Math.random() * 500; // Add up to 500ms jitter
    return exponentialDelay + jitter;
  }

  static logError(error: AppError, context?: string): void {
    if (import.meta.env.VITE_DEBUG_LOGGING === 'true') {
      console.group(`🚨 Error ${context ? `in ${context}` : ''}`);
      console.error('Type:', error.type);
      console.error('Message:', error.message);
      console.error('User Message:', error.userMessage);
      console.error('Details:', error.details);
      console.groupEnd();
    }
  }
}