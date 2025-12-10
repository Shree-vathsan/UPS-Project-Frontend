import React from 'react';

interface StatusBadgeProps {
    status: string;
    className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
    const getStatusStyles = (status: string) => {
        const lowerStatus = status.toLowerCase();

        if (lowerStatus === 'merged') {
            return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
        }
        if (lowerStatus === 'open' || lowerStatus === 'added') {
            return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
        }
        if (lowerStatus === 'closed' || lowerStatus === 'deleted' || lowerStatus === 'removed') {
            return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
        }
        if (lowerStatus === 'modified') {
            return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300';
        }

        // Default gray
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    };

    return (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusStyles(status)} ${className}`}>
            {status}
        </span>
    );
};
