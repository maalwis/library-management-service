'use client';

import { useEffect } from 'react';

export default function ErrorFallback({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
    useEffect(() => {
        console.error('BooksPage error:', error);
    }, [error]);

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold text-red-600">Something went wrong</h1>
            <p className="mt-4 text-gray-700">
                Unable to load books right now. Please try again later.
            </p>
            <button
                onClick={() => reset()}
                className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                Try again
            </button>
        </div>
    );
}
