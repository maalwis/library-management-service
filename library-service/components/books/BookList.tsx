'use client';

import { Book } from '@/types/book.types';
import { BookCard } from './BookCard';

interface BookListProps {
    books: Book[];
}

export function BookList({ books }: BookListProps) {
    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {books.map((book) => (
                    <BookCard key={book.id} book={book} />
                ))}
            </div>
        </div>
    );
}