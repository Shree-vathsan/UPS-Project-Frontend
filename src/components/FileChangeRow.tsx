import React from 'react';
import { StatusBadge } from './StatusBadge';

interface FileChangeRowProps {
    name: string;
    status: string;
    additions: number;
    deletions: number;
    className?: string;
    variant?: 'default' | 'dark'; // For different background colors if needed
}

export const FileChangeRow: React.FC<FileChangeRowProps> = ({
    name,
    status,
    additions,
    deletions,
    className = '',
    variant = 'default'
}) => {
    const bgClass = variant === 'dark'
        ? 'bg-gray-900 border border-gray-800'
        : 'bg-white dark:bg-gray-800 border dark:border-gray-700';

    const textColor = variant === 'dark' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300';

    return (
        <div className={`${bgClass} rounded-lg p-3 flex items-center justify-between ${className}`}>
            <div className="flex items-center gap-2">
                <span className={`text-sm font-mono ${textColor}`}>{name}</span>
                <StatusBadge status={status} className="!rounded !px-1.5 !text-[10px]" />
            </div>
            <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-green-600 dark:text-green-400">+{additions}</span>
                <span className="text-red-600 dark:text-red-400">-{deletions}</span>
                <span className="text-gray-400">→</span>
            </div>
        </div>
    );
};
