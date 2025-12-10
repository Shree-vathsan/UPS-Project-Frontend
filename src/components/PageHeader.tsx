import React from 'react';
import { Back } from './Back';

interface PageHeaderProps {
    title: string;
    description?: string;
    backTo?: string;
    backLabel?: string; // Although we standardized to remove labels, keeping it optional just in case
    children?: React.ReactNode; // For extra actions like branch selector
    className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
    title,
    description,
    backTo,
    backLabel,
    children,
    className = ''
}) => {
    return (
        <header className={`flex items-start justify-between gap-6 mb-6 ${className}`}>
            <div>
                {backTo ? (
                    <Back to={backTo} label={backLabel} className="mb-2" />
                ) : (
                    <Back className="mb-2" />
                )}

                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {title}
                </h1>

                {description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {description}
                    </p>
                )}
            </div>

            {children && (
                <div className="flex items-center gap-4">
                    {children}
                </div>
            )}
        </header>
    );
};
