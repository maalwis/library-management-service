// app/books/page.tsx
import { getBooks } from '../../lib/books';
import { Book } from '../../types/book';

export const metadata = {
  title: 'Books — Library',
  description: 'List of books from the API',
};

export default async function BooksPage() {
  let books: Book[] = [];

  try {
    books = await getBooks();
  } catch (error) {
    console.error('Error fetching books:', error);
    
  }

  return (
    <main className="p-8 bg-zinc-50 dark:bg-black min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Books Library</h1>
      {books.length === 0 ? (
        <p>No books available.</p>
      ) : (
        <ul className="space-y-4">
          {books.map((book) => (
            <li key={book.id} className="border p-4 rounded shadow bg-white dark:bg-gray-800">
              <h2 className="text-xl font-semibold">{book.title}</h2>
              <p className="text-gray-600 dark:text-gray-400">By: {book.author}</p>
              <p className="mt-2">{book.description}</p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
