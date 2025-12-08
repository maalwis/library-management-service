import { booksService } from '@/services/books.service';
import { BookForm } from '@/components/books/BookForm';
import { notFound } from 'next/navigation';
import { updateBookAction } from './actions';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EditBookPage({ params }: PageProps) {
    const resolvedParams = await params;
    const bookId = parseInt(resolvedParams.id);

    if (isNaN(bookId)) {
        notFound();
    }

    const book = await booksService.getById(bookId);

    if (!book) {
        notFound();
    }

    return (
        <div className="container mx-auto p-6 max-w-2xl">
            <h1 className="text-3xl font-bold mb-6">Edit Book</h1>
            <BookForm
                initialData={book}
                bookId={bookId}
                updateAction={updateBookAction}
            />
        </div>
    );
}