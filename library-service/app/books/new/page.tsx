import { NewBookForm } from '@/components/books/NewBookForm';
import { createBookAction } from './actions';

export default function NewBookPage() {
    return (
        <div className="container mx-auto p-6 max-w-2xl">
            <h1 className="text-3xl font-bold mb-6">Add New Book</h1>
            <NewBookForm createAction={createBookAction} />
        </div>
    );
}