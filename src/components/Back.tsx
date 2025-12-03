import React from 'react';
import { useNavigate } from 'react-router-dom';

interface BackProps {
    to?: string;
    label?: string;
    className?: string;
}

export const Back: React.FC<BackProps> = ({ to, label = 'Back', className = '' }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (to) {
            navigate(to);
        } else {
            navigate(-1);
        }
    };

    return (
        <button
            onClick={handleClick}
            className={`text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 transition-colors ${className}`}
        >
            <span>←</span>
            <span>{label}</span>
        </button>
    );
};
