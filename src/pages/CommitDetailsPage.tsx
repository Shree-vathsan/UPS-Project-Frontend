import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { mockCommits } from '../data/mockData';

const CommitDetailsPage: React.FC = () => {
    const { commitId } = useParams();
    const navigate = useNavigate();

    const commit = useMemo(() => {
        return mockCommits.find(c => c.id === commitId);
    }, [commitId]);

    if (!commit) {
        return (
            <Layout>
                <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                    Commit not found
                </div>
            </Layout>
        );
    }

    return (
        <Layout showTabs={false}>
            <div className="max-w-5xl mx-auto">
                {/* Back button */}
                <button
                    onClick={() => navigate(-1)}
                    className="bg-gray-800 text-white text-xs px-3 py-1.5 rounded-md mb-4 hover:bg-gray-700 transition-colors"
                >
                    ← Back
                </button>

                {/* Commit SHA Badge */}
                <div className="mb-2">
                    <span className="bg-indigo-600 text-white text-xs font-mono px-2 py-0.5 rounded">
                        {commit.id.substring(0, 7)}
                    </span>
                    <span className="text-gray-500 text-xs ml-2">{commit.date}</span>
                </div>

                {/* Commit Message */}
                <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                    {commit.message}
                </h1>
                <div className="flex items-center gap-4 text-xs mb-6">
                    <span className="text-green-500">+{commit.additions} additions</span>
                    <span className="text-red-500">-{commit.deletions} deletions</span>
                    <span className="text-gray-500">{commit.filesChangedCount} files changed</span>
                </div>

                {/* Commit Info Card */}
                <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
                    <h3 className="text-white font-semibold mb-4">Commit Information</h3>
                    <div className="space-y-3 text-sm">
                        <div className="flex flex-col gap-1">
                            <span className="text-gray-500">SHA:</span>
                            <span className="text-blue-400 font-mono text-xs bg-gray-800/50 p-1 rounded w-fit">{commit.id}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-gray-500">Message:</span>
                            <span className="text-gray-300">{commit.message}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-gray-500">Author:</span>
                            <span className="text-gray-300">{commit.author}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-gray-500">Date:</span>
                            <span className="text-gray-300">{commit.date}</span>
                        </div>
                    </div>
                </div>

                {/* Files Changed */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Files Changed ({commit.files.length})</h3>
                    <div className="space-y-2">
                        {commit.files.map((file, index) => (
                            <div key={index} className="bg-gray-900 border border-gray-800 rounded-lg p-3 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-mono text-gray-300">{file.name}</span>
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${file.status === 'modified' ? 'bg-yellow-900/50 text-yellow-500' :
                                        file.status === 'added' ? 'bg-green-900/50 text-green-500' :
                                            'bg-red-900/50 text-red-500'
                                        }`}>
                                        {file.status}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-xs font-mono">
                                    <span className="text-green-500">+{file.additions}</span>
                                    <span className="text-red-500">-{file.deletions}</span>
                                    <span className="text-gray-600">▶</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </Layout>
    );
};

export default CommitDetailsPage;
