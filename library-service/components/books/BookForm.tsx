'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Book, BookUpdateDto } from '@/types/book.types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

interface BookFormProps {
    initialData: Book;
    bookId: number;
    updateAction: (bookId: number, data: BookUpdateDto) => Promise<{ success: boolean; bookId?: number; error?: string }>;
}

export function BookForm({ initialData, bookId, updateAction }: BookFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        title: initialData.title,
        description: initialData.description || '',
        authorName: initialData.authorName,
        totalCopies: initialData.totalCopies.toString(),
        availableCopies: initialData.availableCopies.toString(),
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const validateForm = (): boolean => {
        if (!formData.title.trim()) {
            setError('Title is required');
            return false;
        }
        if (!formData.authorName.trim()) {
            setError('Author name is required');
            return false;
        }

        const totalCopies = parseInt(formData.totalCopies);
        if (isNaN(totalCopies) || totalCopies < 1) {
            setError('Total copies must be at least 1');
            return false;
        }

        if (formData.availableCopies) {
            const availableCopies = parseInt(formData.availableCopies);
            if (isNaN(availableCopies) || availableCopies < 0) {
                setError('Available copies must be 0 or greater');
                return false;
            }
            if (availableCopies > totalCopies) {
                setError('Available copies cannot exceed total copies');
                return false;
            }
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        if (!validateForm()) {
            return;
        }

        const data: BookUpdateDto = {
            title: formData.title.trim(),
            description: formData.description.trim(),
            authorName: formData.authorName.trim(),
            totalCopies: parseInt(formData.totalCopies),
        };

        // Only include availableCopies if it changed
        if (formData.availableCopies !== initialData.availableCopies.toString()) {
            data.availableCopies = parseInt(formData.availableCopies);
        }

        startTransition(async () => {
            const result = await updateAction(bookId, data);

            if (result.success && result.bookId) {
                router.push(`/books/${result.bookId}`);
            } else if (result.error) {
                setError(result.error);
            }
        });
    };

    const handleCancel = () => {
        router.push(`/books/${bookId}`);
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
                    value={formData.title}
                    onChange={handleChange}
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
                        value={formData.description}
                        onChange={handleChange}
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
                    value={formData.authorName}
                    onChange={handleChange}
                    required
                    placeholder="Enter author name"
                    disabled={isPending}
                />

                <Input
                    label="Total Copies"
                    name="totalCopies"
                    type="number"
                    value={formData.totalCopies}
                    onChange={handleChange}
                    required
                    min="1"
                    placeholder="Enter total number of copies"
                    disabled={isPending}
                />

                <Input
                    label="Available Copies"
                    name="availableCopies"
                    type="number"
                    value={formData.availableCopies}
                    onChange={handleChange}
                    min="0"
                    max={formData.totalCopies}
                    placeholder="Update available copies"
                    disabled={isPending}
                    helpText={`Currently ${initialData.availableCopies} copies available out of ${initialData.totalCopies}`}
                />

                <div className="flex gap-4 pt-4">
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={isPending}
                        fullWidth={false}
                    >
                        {isPending ? 'Updating...' : 'Update Book'}
                    </Button>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={handleCancel}
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