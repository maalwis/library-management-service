import { booksService } from '@/services/books.service';
import { BookList } from '@/components/books/BookList';
import Link from 'next/link';

export default async function BooksPage() {
    const books = await booksService.getAll();

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Library Books</h1>
                <Link
                    href="/books/new"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Add New Book
                </Link>
            </div>

            {books.length === 0 ? (
                <p className="text-gray-600">No books found in the library.</p>
            ) : (
                <BookList books={books} />
            )}
        </div>
    );
}