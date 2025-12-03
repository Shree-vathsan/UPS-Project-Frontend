import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { mockPullRequests } from '../data/mockData';

const PullRequestDetailsPage: React.FC = () => {
    // const { repoName, prId } = useParams();
    const{ prId } = useParams();
    const navigate = useNavigate();

    const pr = useMemo(() => {
        return mockPullRequests.find(p => p.number === Number(prId));
    }, [prId]);

    if (!pr) {
        return (
            <Layout>
                <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                    Pull Request not found
                </div>
            </Layout>
        );
    }

    return (
        <Layout showTabs={false}>
            <div className="max-w-4xl mx-auto">
                {/* Back button */}
                <button onClick={() => navigate(-1)}
                    className="text-sm text-blue-600 dark:text-blue-400 flex items-center gap-1 mb-4 hover:underline"
                >
                    ← Back
                </button>


                {/* Header */}
                <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">PR #{pr.number}</h1>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${pr.status === 'Merged' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' :
                        pr.status === 'Open' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                            'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                        }`}>
                        {pr.status}
                    </span>
                </div>
                <h2 className="text-lg text-gray-700 dark:text-gray-300 mb-6">{pr.title}</h2>

                {/* Info Card */}
                <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg overflow-hidden mb-6">
                    {/* Author */}
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                            {pr.authorAvatar ? <img src={pr.authorAvatar} alt={pr.author} /> : null}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{pr.author}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Author</p>
                        </div>
                    </div>

                    {/* Branches */}
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Branches</p>
                        <div className="flex items-center gap-2 text-sm font-mono">
                            <span className="bg-gray-100 dark:bg-gray-700/50 px-2 py-1 rounded text-blue-600 dark:text-blue-400">{pr.sourceBranch}</span>
                            <span className="text-gray-400">→</span>
                            <span className="bg-gray-100 dark:bg-gray-700/50 px-2 py-1 rounded text-blue-600 dark:text-blue-400">{pr.targetBranch}</span>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="p-4">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Timeline</p>
                        <div className="space-y-1 text-xs text-gray-600 dark:text-gray-300">
                            <div className="flex justify-between">
                                <span>Created:</span>
                                <span className="font-mono">{pr.created}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Updated:</span>
                                <span className="font-mono">{pr.updated}</span>
                            </div>
                            {pr.merged && (
                                <div className="flex justify-between">
                                    <span>Merged:</span>
                                    <span className="font-mono">{pr.merged}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Files Changed */}
                <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Files Changed ({pr.filesChanged.length})</h3>
                    <div className="space-y-2">
                        {pr.filesChanged.map((file, index) => (
                            <div key={index} className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-3 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-mono text-gray-700 dark:text-gray-300">{file.name}</span>
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${file.status === 'modified' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                                        file.status === 'added' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                                            'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                                        }`}>
                                        {file.status}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-xs font-mono">
                                    <span className="text-green-600 dark:text-green-400">+{file.additions}</span>
                                    <span className="text-red-600 dark:text-red-400">-{file.deletions}</span>
                                    <span className="text-gray-400">→</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </Layout>
    );
};

export default PullRequestDetailsPage;
