import { HTTP_STATUS, ERROR_MESSAGES } from '@/config/constants';

export interface ApiError {
    status?: number;
    message: string;
    detail?: string;
}

/**
 * Handles API errors and returns a user-friendly error message
 */
export function handleApiError(error: unknown): string {
    // Check if it's our custom API error format
    if (isApiError(error)) {
        const apiError = error as ApiError;

        // Handle specific HTTP status codes
        switch (apiError.status) {
            case HTTP_STATUS.BAD_REQUEST:
                return apiError.message || ERROR_MESSAGES.VALIDATION_ERROR;

            case HTTP_STATUS.UNAUTHORIZED:
                return ERROR_MESSAGES.UNAUTHORIZED;

            case HTTP_STATUS.FORBIDDEN:
                return ERROR_MESSAGES.UNAUTHORIZED;

            case HTTP_STATUS.NOT_FOUND:
                return apiError.message || ERROR_MESSAGES.NOT_FOUND;

            case HTTP_STATUS.INTERNAL_SERVER_ERROR:
                return apiError.detail || ERROR_MESSAGES.SERVER_ERROR;

            default:
                return apiError.message || ERROR_MESSAGES.UNKNOWN_ERROR;
        }
    }

    // Handle network errors
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
        return ERROR_MESSAGES.NETWORK_ERROR;
    }

    // Handle standard Error objects
    if (error instanceof Error) {
        return error.message || ERROR_MESSAGES.UNKNOWN_ERROR;
    }

    // Handle string errors
    if (typeof error === 'string') {
        return error;
    }

    // Fallback for unknown error types
    console.error('Unknown error type:', error);
    return ERROR_MESSAGES.UNKNOWN_ERROR;
}

/**
 * Type guard to check if error matches ApiError interface
 */
function isApiError(error: unknown): error is ApiError {
    return (
        typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        true
    );
}

/**
 * Logs error to console in development and to external service in production
 */
export function logError(error: unknown, context?: string): void {
    const errorMessage = handleApiError(error);

    if (process.env.NODE_ENV === 'development') {
        console.error(`[Error${context ? ` - ${context}` : ''}]:`, errorMessage, error);
    } else {
        // In production, send to error tracking service (e.g., Sentry)
        // Example: Sentry.captureException(error);
        console.error(errorMessage);
    }
}

/**
 * Creates a formatted error response for API calls
 */
export function createErrorResponse(
    message: string,
    status?: number,
    detail?: string
): ApiError {
    return {
        status,
        message,
        detail,
    };
}

/**
 * Validates if a response is successful based on status code
 */
export function isSuccessResponse(status: number): boolean {
    return status >= 200 && status < 300;
}

/**
 * Extracts validation errors from API response
 */
export function extractValidationErrors(error: unknown): Record<string, string[]> | null {
    if (isApiError(error) && error.status === HTTP_STATUS.BAD_REQUEST) {
        // Assuming .NET returns ModelState errors in a specific format
        // Adjust based on your actual API response structure
        const apiError = error as any;

        if (apiError.errors && typeof apiError.errors === 'object') {
            return apiError.errors;
        }
    }

    return null;
}

/**
 * Formats validation errors for display
 */
export function formatValidationErrors(errors: Record<string, string[]>): string {
    return Object.entries(errors)
        .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
        .join('; ');
}