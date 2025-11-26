import React from 'react';
import { Btn } from './Button';
import { useNavigate, useParams } from 'react-router-dom';
import { mockPullRequests } from '../data/mockData';

const PullRequestList: React.FC = () => {
    const navigate = useNavigate();
    const { repoName } = useParams();

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Pull Requests ({mockPullRequests.length})</h2>
                <div className="flex gap-2">
                    <div className="bg-blue-600 text-white px-3 py-1 rounded-md text-xs font-medium cursor-pointer">All</div>
                    <div className="text-gray-600 dark:text-gray-400 px-3 py-1 rounded-md text-xs font-medium hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">Open</div>
                    <div className="text-gray-600 dark:text-gray-400 px-3 py-1 rounded-md text-xs font-medium hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">Closed</div>
                </div>
            </div>

            <div className="space-y-3">
                {mockPullRequests.map((pr) => (
                    <div key={pr.id} className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <span className="w-5 h-5 flex items-center justify-center bg-gray-700 rounded text-white text-xs">
                                    <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
                                        <path d="M4.75 3a1.75 1.75 0 100 3.5 1.75 1.75 0 000-3.5zM3.5 4.75a.25.25 0 11.5 0 .25.25 0 01-.5 0zM4.75 9.5a1.75 1.75 0 100 3.5 1.75 1.75 0 000-3.5zM3.5 11.25a.25.25 0 11.5 0 .25.25 0 01-.5 0zM9.75 3a1.75 1.75 0 100 3.5 1.75 1.75 0 000-3.5zM8.5 4.75a.25.25 0 11.5 0 .25.25 0 01-.5 0z" />
                                        <path fillRule="evenodd" d="M5.75 6.5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5a.75.75 0 01.75-.75zm5-1.75a.75.75 0 01.75.75v.5a.75.75 0 01-1.5 0v-.5a.75.75 0 01.75-.75z" />
                                    </svg>
                                </span>
                                <h3
                                    className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                                    onClick={() => navigate(`/repo/${repoName}/pr/${pr.number}`)}
                                >
                                    {pr.title}
                                </h3>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 ml-7">
                                <span>#{pr.number}</span>
                                <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${pr.status === 'Merged' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' :
                                        pr.status === 'Open' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                                            'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                                    }`}>
                                    {pr.status}
                                </span>
                                {/* <span>by {pr.author}</span> */}
                            </div>
                        </div>

                        <Btn
                            variant="secondary"
                            className="!py-1.5 !px-3 !text-xs"
                            onClick={() => navigate(`/repo/${repoName}/pr/${pr.number}`)}
                        >
                            View PR →
                        </Btn>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PullRequestList;
