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

    const availabilityStatus = book.availableCopies > 0 ? 'Available' : 'Unavailable';
    const statusColorClass = book.availableCopies > 0 ? 'text-green-600' : 'text-red-600';

    return (
        <Link href={`/books/${book.id}`} className="block">
            <div className="border rounded-lg p-4 shadow hover:shadow-lg transition-all duration-200 bg-gray-100 cursor-pointer h-[400px]">
                {/* Title */}
                <h3 className="text-lg font-semibold mb-2 text-gray-900">
                    {book.title}
                </h3>

                {/* Author */}
                <p className="text-gray-700 mb-2 text-sm">
                    by <span className="font-medium">{book.authorName}</span>
                </p>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 overflow-hidden">
                    {book.description
                        ? truncateText(book.description, 100)
                        : <span className="italic text-gray-400">No description available</span>
                    }
                </p>

                {/* Availability */}
                <div className="mt-auto pt-3 border-t border-gray-300">
                    <p className="text-sm text-gray-700">
                        <span className="font-medium">Copies:</span>{' '}
                        <span className={statusColorClass}>{book.availableCopies}</span>
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
