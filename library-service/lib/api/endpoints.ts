export const API_ENDPOINTS = {
    BOOKS: {
        BASE: '/api/v1/books',
        BY_ID: (id: number) => `/api/v1/books/${id}`,
    },
} as const;