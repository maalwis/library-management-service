import Link from 'next/link';

export default function Home() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="text-center space-y-6 p-8">
                <h1 className="text-5xl font-bold text-gray-900 dark:text-white">
                    Library Management
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                    Welcome to Library Management Service
                </p>

                <div className="pt-4">
                    <Link href="/books">
                        <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
                            Browse Books
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}