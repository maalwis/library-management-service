'use client';

import { Book } from '@/types/book.types';
import { BookCard } from './BookCard';

interface BookListProps {
    books: Book[];
}

export function BookList({ books }: BookListProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book) => (
                <BookCard key={book.id} book={book} />
            ))}
        </div>
    );
}