'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { Book } from '@/types/book.types';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface BookDetailsProps {
    book: Book;
    deleteAction: (bookId: number) => Promise<{ error?: string } | void>;
}

export function BookDetails({ book, deleteAction }: BookDetailsProps) {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    const handleDelete = async () => {
        if (!confirm(`Are you sure you want to delete "${book.title}"?`)) {
            return;
        }

        setError(null);

        startTransition(async () => {
            const result = await deleteAction(book.id);
            if (result?.error) {
                setError(result.error);
            }
            // If successful, redirect happens in the action
        });
    };

    const availabilityStatus = book.availableCopies > 0 ? 'Available' : 'Unavailable';
    const statusColor = book.availableCopies > 0 ? 'text-green-600' : 'text-red-600';
    const borrowedCopies = book.totalCopies - book.availableCopies;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <Link
                        href="/books"
                        className="text-blue-600 hover:underline mb-2 inline-block"
                    >
                        ← Back to Books
                    </Link>
                    <h1 className="text-4xl font-bold">{book.title}</h1>
                </div>
                <div className="flex gap-2">
                    <Link href={`/books/${book.id}/edit`}>
                        <Button variant="primary">Edit</Button>
                    </Link>
                    <Button
                        variant="danger"
                        onClick={handleDelete}
                        disabled={isPending}
                    >
                        {isPending ? 'Deleting...' : 'Delete'}
                    </Button>
                </div>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            <Card>
                <div className="space-y-6">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-600 uppercase mb-2">
                            Description
                        </h3>
                        <p className="text-lg text-gray-800 leading-relaxed">
                            {book.description || (
                                <span className="italic text-gray-400">
                                    No description available
                                </span>
                            )}
                        </p>
                    </div>

                    <div className="border-t border-gray-200"></div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-600 uppercase mb-1">
                                Author
                            </h3>
                            <p className="text-lg">{book.authorName}</p>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-gray-600 uppercase mb-1">
                                Status
                            </h3>
                            <p className={`text-lg font-semibold ${statusColor}`}>
                                {availabilityStatus}
                            </p>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-gray-600 uppercase mb-1">
                                Total Copies
                            </h3>
                            <p className="text-lg">{book.totalCopies}</p>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-gray-600 uppercase mb-1">
                                Available Copies
                            </h3>
                            <p className="text-lg">{book.availableCopies}</p>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-gray-600 uppercase mb-1">
                                Borrowed Copies
                            </h3>
                            <p className="text-lg">{borrowedCopies}</p>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-gray-600 uppercase mb-1">
                                Book ID
                            </h3>
                            <p className="text-lg text-gray-500">#{book.id}</p>
                        </div>
                    </div>
                </div>
            </Card>

            {book.availableCopies === 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
                    <p className="text-yellow-800">
                        ⚠️ This book is currently Unavailable.
                    </p>
                </div>
            )}
        </div>
    );
}