// API Configuration
export const API_CONFIG = {
    BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
    VERSION: 'v1',
    TIMEOUT: 30000, // 30 seconds
} as const;

// API Endpoints
export const API_ROUTES = {
    BOOKS: {
        BASE: '/api/v1/books',
        BY_ID: (id: number) => `/api/v1/books/${id}`,
    },
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
    NETWORK_ERROR: 'Network error. Please check your connection.',
    SERVER_ERROR: 'Server error. Please try again later.',
    NOT_FOUND: 'The requested resource was not found.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    VALIDATION_ERROR: 'Please check your input and try again.',
    UNKNOWN_ERROR: 'An unexpected error occurred.',
} as const;

// Validation Rules
export const VALIDATION = {
    BOOK: {
        TITLE_MIN_LENGTH: 1,
        TITLE_MAX_LENGTH: 200,
        AUTHOR_MIN_LENGTH: 1,
        AUTHOR_MAX_LENGTH: 100,
        ISBN_MIN_LENGTH: 10,
        ISBN_MAX_LENGTH: 17,
        MIN_YEAR: 1000,
        MAX_YEAR: new Date().getFullYear() + 1,
        MIN_COPIES: 0,
        MAX_COPIES: 9999,
    },
} as const;

// UI Configuration
export const UI_CONFIG = {
    DEBOUNCE_DELAY: 300,
    TOAST_DURATION: 5000,
    PAGINATION: {
        DEFAULT_PAGE_SIZE: 10,
        PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
    },
} as const;

// Date Formats
export const DATE_FORMATS = {
    DISPLAY: 'MMM dd, yyyy',
    API: 'yyyy-MM-dd',
    FULL: 'MMMM dd, yyyy HH:mm:ss',
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
    THEME: 'app_theme',
    USER_PREFERENCES: 'user_preferences',
} as const;

// Application Routes
export const APP_ROUTES = {
    HOME: '/',
    BOOKS: {
        LIST: '/books',
        DETAIL: (id: number) => `/books/${id}`,
        NEW: '/books/new',
        EDIT: (id: number) => `/books/${id}/edit`,
    },
} as const;