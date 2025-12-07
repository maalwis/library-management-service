export interface Book {
    id: number;
    title: string;
    description: string;
    authorName: string;
    totalCopies: number;
    availableCopies: number;
}

export interface BookCreateDto {
    title: string;
    description: string;
    authorName: string;
    totalCopies: number;
}

export interface BookUpdateDto {
    title?: string;
    description?: string;
    authorName?: string;
    totalCopies?: number;
    availableCopies?: number;
}

export interface ApiError {
    message: string;
    detail?: string;
}

export interface ApiResponse<T> {
    data?: T;
    error?: ApiError;
}