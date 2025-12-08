'use server';

import { booksService } from '@/services/books.service';
import { BookUpdateDto } from '@/types/book.types';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function updateBookAction(bookId: number, data: BookUpdateDto) {
    try {
        const updatedBook = await booksService.update(bookId, data);

        if (!updatedBook) {
            return { success: false, error: 'Book not found' };
        }

        revalidatePath(`/books/${bookId}`);
        revalidatePath('/books');
        return { success: true, bookId };
    } catch (error: any) {
        return { success: false, error: error.message || 'Failed to update book' };
    }
}