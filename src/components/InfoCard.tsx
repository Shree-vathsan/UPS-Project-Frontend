import React from 'react';

interface InfoCardProps {
    children: React.ReactNode;
    className?: string;
    variant?: 'default' | 'dark';
}

export const InfoCard: React.FC<InfoCardProps> = ({
    children,
    className = '',
    variant = 'default'
}) => {
    const bgClass = variant === 'dark'
        ? 'bg-gray-900 border border-gray-800'
        : 'bg-white dark:bg-gray-800 border dark:border-gray-700';

    return (
        <div className={`${bgClass} rounded-lg overflow-hidden ${className}`}>
            {children}
        </div>
    );
};

export const InfoCardSection: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
    return (
        <div className={`p-4 border-b border-gray-200 dark:border-gray-700 last:border-0 ${className}`}>
            {children}
        </div>
    );
};
