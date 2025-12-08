import { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
    padding?: 'none' | 'sm' | 'md' | 'lg';
    shadow?: 'none' | 'sm' | 'md' | 'lg';
    hover?: boolean;
}

export function Card({
                         children,
                         className = '',
                         padding = 'md',
                         shadow = 'md',
                         hover = false,
                     }: CardProps) {
    const paddingStyles = {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
    };

    const shadowStyles = {
        none: '',
        sm: 'shadow-sm',
        md: 'shadow-md',
        lg: 'shadow-lg',
    };

    const hoverStyle = hover ? 'hover:shadow-xl transition-shadow' : '';

    return (
        <div
            className={`bg-white rounded-lg border border-gray-200 ${paddingStyles[padding]} ${shadowStyles[shadow]} ${hoverStyle} ${className}`}
        >
            {children}
        </div>
    );
}