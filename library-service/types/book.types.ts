export interface Book {
    id: number;
    title: string;
    description: string;
    authorName: string;
    totalCopies: number;
    availableCopies: number;
}

// Matches BookCreateDto from .NET
export interface BookCreateDto {
    title: string;
    description: string;
    authorName: string;
    totalCopies: number;
}

// Matches BookUpdateDto from .NET
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