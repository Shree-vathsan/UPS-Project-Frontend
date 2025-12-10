import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { mockCommits } from '../data/mockData';
import { Back } from "../components/Back";
import { FileChangeRow } from "../components/FileChangeRow";
import { InfoCard } from "../components/InfoCard";

const CommitDetailsPage: React.FC = () => {
    const { commitId } = useParams();

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
                <Back className="mb-4" />

                {/* Commit SHA Badge */}
                <div className="mb-2">
                    <span className="bg-indigo-600 text-white text-xs font-mono px-2 py-0.5 rounded">
                        {commit.id.substring(0, 7)}
                    </span>
                    <span className="text-gray-500 text-xs ml-2">{commit.date}</span>
                </div>

                {/* Commit Message */}
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {commit.message}
                </h1>
                <div className="flex items-center gap-4 text-xs mb-6">
                    <span className="text-green-500">+{commit.additions} additions</span>
                    <span className="text-red-500">-{commit.deletions} deletions</span>
                    <span className="text-gray-500">{commit.filesChangedCount} files changed</span>
                </div>

                {/* Commit Info Card */}
                <InfoCard variant="dark" className="p-6 mb-8">
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
                </InfoCard>

                {/* Files Changed */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Files Changed ({commit.files.length})</h3>
                    <div className="space-y-2">
                        {commit.files.map((file, index) => (
                            <FileChangeRow
                                key={index}
                                name={file.name}
                                status={file.status}
                                additions={file.additions}
                                deletions={file.deletions}
                                variant="dark"
                            />
                        ))}
                    </div>
                </div>

            </div>
        </Layout>
    );
};

export default CommitDetailsPage;
