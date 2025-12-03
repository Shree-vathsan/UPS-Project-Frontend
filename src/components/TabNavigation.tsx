import React from 'react';

interface Tab {
    id: string;
    label: string;
}

interface TabNavigationProps {
    tabs: Tab[];
    activeTab: string;
    onTabChange: (id: string) => void;
    className?: string;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
    tabs,
    activeTab,
    onTabChange,
    className = ''
}) => {
    return (
        <div className={`flex gap-6 border-b border-gray-200 dark:border-gray-800 mb-6 ${className}`}>
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    className={`pb-2 text-sm font-medium transition-colors ${activeTab === tab.id
                            ? "text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400"
                            : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                        }`}
                    onClick={() => onTabChange(tab.id)}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
};
