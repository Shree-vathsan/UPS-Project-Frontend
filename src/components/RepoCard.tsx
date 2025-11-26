import React from "react";

type Repo = {
    name: string;
    description: string;
    stargazers_count: number;
    forks_count: number;
    updated_at: string;
    private: boolean;
};

type Props = {
    repo: Repo;
    onClick: () => void;
};

const RepoCard: React.FC<Props> = ({ repo, onClick }) => {
    return (
        <div
            onClick={onClick}
            className="w-full bg-white dark:bg-[#10182b] border border-gray-200 dark:border-gray-800 rounded-xl p-5 flex flex-col gap-3 cursor-pointer hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-500/50 dark:hover:bg-[#1e3a6f] transition-all duration-200 group"
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-base group-hover:text-indigo-700 dark:group-hover:text-indigo-300">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.5h16.5m-16.5 0v13.5a2.25 2.25 0 002.25 2.25h12a2.25 2.25 0 002.25-2.25V4.5m-16.5 0l7.5 7.5m0 0l7.5-7.5m-7.5 7.5V21" />
                    </svg>
                    {repo.name}
                </div>
                <span className={`text-xs border rounded-full px-2.5 py-0.5 font-medium ${repo.private ? 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600' : 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800/30'}`}>
                    {repo.private ? "Private" : "Public"}
                </span>
            </div>

            <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">{repo.description}</p>

            <div className="flex items-center gap-5 text-gray-500 dark:text-gray-400 text-xs pt-2 border-t border-gray-100 dark:border-gray-700 mt-1">
                <div className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-yellow-400">
                        <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" />
                    </svg>
                    {repo.stargazers_count}
                </div>
                <div className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                        <path fillRule="evenodd" d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z" clipRule="evenodd" />
                        <path fillRule="evenodd" d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z" clipRule="evenodd" />
                    </svg>
                    {repo.forks_count}
                </div>
                <div className="ml-auto">Updated {new Date(repo.updated_at).toLocaleDateString()}</div>
            </div>
        </div>
    );
};

export default RepoCard;
