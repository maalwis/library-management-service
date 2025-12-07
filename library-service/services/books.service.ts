import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { Book, BookCreateDto, BookUpdateDto } from '@/types/book.types';

export const booksService = {
    // GET: api/v1/books
    getAll: async (): Promise<Book[]> => {
        try {
            return await apiClient.get<Book[]>(API_ENDPOINTS.BOOKS.BASE);
        } catch (error: any) {
            if (error.status === 404) {
                return []; // Return empty array if no books found
            }
            throw error;
        }
    },

    // GET: api/v1/books/{id}
    getById: async (id: number): Promise<Book | null> => {
        try {
            return await apiClient.get<Book>(API_ENDPOINTS.BOOKS.BY_ID(id));
        } catch (error: any) {
            if (error.status === 404) {
                return null;
            }
            throw error;
        }
    },

    // POST: api/v1/books
    create: async (data: BookCreateDto): Promise<Book> => {
        return await apiClient.post<Book>(API_ENDPOINTS.BOOKS.BASE, data);
    },

    // PUT: api/v1/books/{id}
    update: async (id: number, data: BookUpdateDto): Promise<Book | null> => {
        try {
            return await apiClient.put<Book>(API_ENDPOINTS.BOOKS.BY_ID(id), data);
        } catch (error: any) {
            if (error.status === 404) {
                return null;
            }
            throw error;
        }
    },

    // DELETE: api/v1/books/{id}
    softDelete: async (id: number): Promise<{ message: string }> => {
        return await apiClient.delete<{ message: string }>(
            API_ENDPOINTS.BOOKS.BY_ID(id)
        );
    },
};