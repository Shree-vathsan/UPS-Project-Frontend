import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { mockPullRequests } from '../data/mockData';
import { Back } from "../components/Back";
import { StatusBadge } from "../components/StatusBadge";
import { Avatar } from "../components/Avatar";
import { FileChangeRow } from "../components/FileChangeRow";
import { InfoCard, InfoCardSection } from "../components/InfoCard";

const PullRequestDetailsPage: React.FC = () => {
    const { prId } = useParams();

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
                <Back className="mb-4" />

                {/* Header */}
                <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">PR #{pr.number}</h1>
                    <StatusBadge status={pr.status} />
                </div>
                <h2 className="text-lg text-gray-700 dark:text-gray-300 mb-6">{pr.title}</h2>

                {/* Info Card */}
                <InfoCard className="mb-6">
                    {/* Author */}
                    <InfoCardSection className="flex items-center gap-3">
                        <Avatar src={pr.authorAvatar} alt={pr.author} />
                        <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{pr.author}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Author</p>
                        </div>
                    </InfoCardSection>

                    {/* Branches */}
                    <InfoCardSection>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Branches</p>
                        <div className="flex items-center gap-2 text-sm font-mono">
                            <span className="bg-gray-100 dark:bg-gray-700/50 px-2 py-1 rounded text-blue-600 dark:text-blue-400">{pr.sourceBranch}</span>
                            <span className="text-gray-400">→</span>
                            <span className="bg-gray-100 dark:bg-gray-700/50 px-2 py-1 rounded text-blue-600 dark:text-blue-400">{pr.targetBranch}</span>
                        </div>
                    </InfoCardSection>

                    {/* Timeline */}
                    <InfoCardSection>
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
                    </InfoCardSection>
                </InfoCard>

                {/* Files Changed */}
                <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Files Changed ({pr.filesChanged.length})</h3>
                    <div className="space-y-2">
                        {pr.filesChanged.map((file, index) => (
                            <FileChangeRow
                                key={index}
                                name={file.name}
                                status={file.status}
                                additions={file.additions}
                                deletions={file.deletions}
                            />
                        ))}
                    </div>
                </div>

            </div>
        </Layout>
    );
};

export default PullRequestDetailsPage;
