'use server';

import { booksService } from '@/services/books.service';
import { BookCreateDto } from '@/types/book.types';
import { revalidatePath } from 'next/cache';


export async function createBookAction(data: BookCreateDto) {
    try {
        const newBook = await booksService.create(data);
        revalidatePath('/books');
        return { success: true, bookId: newBook.id };
    } catch (error: any) {
        return { success: false, error: error.message || 'Failed to create book' };
    }
}