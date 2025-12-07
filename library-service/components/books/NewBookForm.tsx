'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { BookCreateDto } from '@/types/book.types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

interface NewBookFormProps {
    createAction: (data: BookCreateDto) => Promise<{ success: boolean; bookId?: number; error?: string }>;
}

export function NewBookForm({ createAction }: NewBookFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        const formData = new FormData(e.currentTarget);
        const data: BookCreateDto = {
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            authorName: formData.get('authorName') as string,
            totalCopies: parseInt(formData.get('totalCopies') as string),
        };

        startTransition(async () => {
            const result = await createAction(data);

            if (result.success && result.bookId) {
                router.push(`/books/${result.bookId}`);
            } else if (result.error) {
                setError(result.error);
            }
        });
    };

    return (
        <Card>
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                    label="Title"
                    name="title"
                    type="text"
                    required
                    placeholder="Enter book title"
                    disabled={isPending}
                />

                <div className="w-full">
                    <label
                        htmlFor="description"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                        placeholder="Enter book description"
                        disabled={isPending}
                    />
                </div>

                <Input
                    label="Author Name"
                    name="authorName"
                    type="text"
                    required
                    placeholder="Enter author name"
                    disabled={isPending}
                />

                <Input
                    label="Total Copies"
                    name="totalCopies"
                    type="number"
                    required
                    min="1"
                    defaultValue="1"
                    placeholder="Enter total number of copies"
                    disabled={isPending}
                />

                <div className="flex gap-4 pt-4">
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={isPending}
                        fullWidth={false}
                    >
                        {isPending ? 'Creating...' : 'Create Book'}
                    </Button>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => router.push('/books')}
                        disabled={isPending}
                        fullWidth={false}
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </Card>
    );
}