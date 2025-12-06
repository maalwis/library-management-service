import { Book } from '../types/book';
import 'server-only';

export async function getBooks(): Promise<Book[]> {
  const res = await fetch('https://localhost:7190/api/v1/books', {

    cache: 'no-store',
    
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch books: ${res.status} ${res.statusText}`);
  }

  const books: Book[] = await res.json();
  return books;
}
