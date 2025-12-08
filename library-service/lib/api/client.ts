const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5115/';

export class ApiClient {
    private baseURL: string;

    constructor() {
        this.baseURL = API_BASE_URL;
    }

    private async handleResponse<T>(response: Response): Promise<T> {
        if (!response.ok) {
            const error = await response.json().catch(() => ({
                message: 'An unexpected error occurred',
                detail: response.statusText,
            }));

            throw {
                status: response.status,
                message: error.message || 'Request failed',
                detail: error.detail,
            };
        }

        // Handle 204 No Content
        if (response.status === 204) {
            return {} as T;
        }

        return response.json();
    }

    async get<T>(endpoint: string): Promise<T> {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            return this.handleResponse<T>(response);
        } catch (error: any) {
            // Network error or fetch failure
            throw {
                status: 0, // indicate network failure
                message: 'Unable to reach backend API',
                detail: error.message,
            };
        }
    }


    async post<T>(endpoint: string, data: unknown): Promise<T> {
        const response = await fetch(`${this.baseURL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        return this.handleResponse<T>(response);
    }

    async put<T>(endpoint: string, data: unknown): Promise<T> {
        const response = await fetch(`${this.baseURL}${endpoint}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        return this.handleResponse<T>(response);
    }

    async delete<T>(endpoint: string): Promise<T> {
        const response = await fetch(`${this.baseURL}${endpoint}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return this.handleResponse<T>(response);
    }
}

export const apiClient = new ApiClient();