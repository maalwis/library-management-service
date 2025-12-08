import { booksService } from '@/services/books.service';
import { BookDetails } from '@/components/books/BookDetails';
import { notFound } from 'next/navigation';
import { deleteBookAction } from './actions';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function BookDetailsPage({ params }: PageProps) {
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
        <div className="container mx-auto p-6">
            <BookDetails book={book} deleteAction={deleteBookAction} />
        </div>
    );
}