'use server';

import { booksService } from '@/services/books.service';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function deleteBookAction(bookId: number) {
    try {
        await booksService.softDelete(bookId);
        revalidatePath('/books');
    } catch (error: any) {
        return { error: error.message || 'Failed to delete book' };
    }
    // redirect() must be outside try-catch because it throws internally
    redirect('/books');

}