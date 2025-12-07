'use client';

import Link from 'next/link';
import { Book } from '@/types/book.types';

interface BookCardProps {
    book: Book;
}

export function BookCard({ book }: BookCardProps) {
    const truncateText = (text: string, maxLength: number) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    const availabilityStatus = book.availableCopies > 0 ? 'Available' : 'Out of Stock';
    const statusColorClass = book.availableCopies > 0 ? 'text-green-600' : 'text-red-600';

    return (
        <Link href={`/books/${book.id}`} className="block">
            <div className="border rounded-lg p-4 shadow hover:shadow-xl transition-all duration-200 bg-white cursor-pointer hover:border-blue-400 h-full">
                <h3 className="text-xl font-semibold mb-2 text-gray-900 hover:text-blue-600 transition-colors">
                    {book.title}
                </h3>
                <p className="text-gray-600 mb-2 text-sm">
                    by <span className="font-medium">{book.authorName}</span>
                </p>

                <p className="text-sm text-gray-600 mb-3 min-h-[60px]">
                    {book.description
                        ? truncateText(book.description, 100)
                        : <span className="italic text-gray-400">No description available</span>
                    }
                </p>

                <div className="pt-3 border-t border-gray-200">
                    <p className="text-sm text-gray-700">
                        <span className="font-medium">Copies:</span>{' '}
                        <span className={statusColorClass}>
                            {book.availableCopies}
                        </span>
                        <span className="text-gray-500"> / {book.totalCopies}</span>
                    </p>
                    <p className={`text-xs font-semibold mt-1 ${statusColorClass}`}>
                        {availabilityStatus}
                    </p>
                </div>
            </div>
        </Link>
    );
}