import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Library Management System",
    description: "A simple Library Management System built with Next.js",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
        >
        {/* Header */}
        <header className="bg-blue-600 text-white p-4 shadow-md">
            <div className="max-w-6xl mx-auto text-lg font-semibold">
                Library Management System
            </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow">
            {children}
        </main>

        {/* Footer */}
        <footer className="bg-gray-800 text-gray-200 p-4 mt-4">
            <div className="max-w-6xl mx-auto text-center text-sm">
                &copy; {new Date().getFullYear()} Library Management System. All rights reserved.
            </div>
        </footer>
        </body>
        </html>
    );
}
