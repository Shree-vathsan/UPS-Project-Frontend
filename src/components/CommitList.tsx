// import React from 'react';
// import { Btn } from './Button';
// import { useNavigate, useParams } from 'react-router-dom';
// import { mockCommits } from '../data/mockData';

// const CommitList: React.FC = () => {
//     const navigate = useNavigate();
//     const { repoName } = useParams();

//     return (
//         <div className="space-y-4">
//             <div className="flex items-center justify-between mb-4">
//                 <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Commits ({mockCommits.length})</h2>
//                 <div className="flex gap-2">
//                     <div className="bg-blue-600 text-white px-3 py-1 rounded-md text-xs font-medium cursor-pointer">All</div>
//                     <div className="text-gray-600 dark:text-gray-400 px-3 py-1 rounded-md text-xs font-medium hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">My Commits</div>
//                 </div>
//             </div>

//             <div className="space-y-3">
//                 {mockCommits.map((commit) => (
//                     <div key={commit.id} className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
//                         <div className="flex flex-col gap-1">
//                             <div className="flex items-center gap-2">
//                                 <span className="w-5 h-5 flex items-center justify-center bg-gray-700 rounded text-white text-xs">
//                                     <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
//                                         <path d="M10.5 7.75a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zm1.43.75a4.002 4.002 0 01-7.86 0H.75a.75.75 0 110-1.5h3.32a4.001 4.001 0 017.86 0h3.32a.75.75 0 110 1.5h-3.32z" />
//                                     </svg>
//                                 </span>
//                                 <h3
//                                     className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
//                                     onClick={() => navigate(`/repo/${repoName}/commit/${commit.id}`)}
//                                 >
//                                     {commit.message}
//                                 </h3>
//                             </div>
//                             <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 ml-7">
//                                 <span className="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded">{commit.id.substring(0, 7)}</span>
//                                 <span>by {commit.author}</span>
//                                 <span>on {commit.date}</span>
//                             </div>
//                         </div>

//                         <Btn
//                             variant="secondary"
//                             className="!py-1.5 !px-3 !text-xs"
//                             onClick={() => navigate(`/repo/${repoName}/commit/${commit.id}`)}
//                         >
//                             View Details →
//                         </Btn>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default CommitList;

import React from 'react';
import { Btn } from './Button';
import { useNavigate, useParams } from 'react-router-dom';
import { mockCommits } from '../data/mockData';

const CommitList: React.FC = () => {
    const navigate = useNavigate();
    const { repoName } = useParams();

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Commits ({mockCommits.length})
                </h2>
                <div className="flex gap-2">
                    <div className="bg-blue-600 text-white px-3 py-1 rounded-md text-xs font-medium cursor-pointer">
                        All
                    </div>
                    <div className="text-gray-600 dark:text-gray-400 px-3 py-1 rounded-md text-xs font-medium hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
                        My Commits
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                {mockCommits.map((commit) => (
                    <div
                        key={commit.id}
                        className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <span className="w-5 h-5 flex items-center justify-center bg-gray-700 rounded text-white text-xs">
                                    <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
                                        <path d="M10.5 7.75a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zm1.43.75a4.002 4.002 0 01-7.86 0H.75a.75.75 0 110-1.5h3.32a4.001 4.001 0 017.86 0h3.32a.75.75 0 110 1.5h-3.32z" />
                                    </svg>
                                </span>

                                <h3
                                    className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                                    onClick={() =>
                                        navigate(`/repo/${repoName}/commit/${commit.id}`, {
                                            state: { activeTab: "commits" } // ⭐ CHANGED
                                        })
                                    }
                                >
                                    {commit.message}
                                </h3>
                            </div>

                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 ml-7">
                                <span className="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded">
                                    {commit.id.substring(0, 7)}
                                </span>
                                <span>by {commit.author}</span>
                                <span>on {commit.date}</span>
                            </div>
                        </div>

                        <Btn
                            variant="secondary"
                            className="!py-1.5 !px-3 !text-xs"
                            onClick={() =>
                                navigate(`/repo/${repoName}/commit/${commit.id}`, {
                                    state: { activeTab: "commits" } // ⭐ CHANGED
                                })
                            }
                        >
                            View Details →
                        </Btn>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CommitList;
