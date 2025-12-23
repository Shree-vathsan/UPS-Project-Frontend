import { useNavigate } from 'react-router-dom';
import { Activity, GitCommit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useTeamActivity } from '../../hooks/useApiQueries';

interface TeamActivityWidgetProps {
    userId: string;
}

interface CommitActivity {
    commitId: string;
    sha: string;
    shortSha: string;
    message: string;
    authorName: string;
    repositoryId: string;
    repositoryName: string;
    ownerUsername: string;
    committedAt: string;
}

export default function TeamActivityWidget({ userId }: TeamActivityWidgetProps) {
    const navigate = useNavigate();
    const { data: activity, isLoading } = useTeamActivity(userId);

    const handleCommitClick = (commit: CommitActivity) => {
        navigate(`/commit/${commit.commitId}`);
    };

    const formatTimeAgo = (date: string) => {
        const diff = Date.now() - new Date(date).getTime();
        const minutes = Math.floor(diff / (1000 * 60));
        if (minutes < 1) return 'just now';
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        if (days < 7) return `${days}d ago`;
        return new Date(date).toLocaleDateString();
    };

    if (isLoading) {
        return (
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-sm font-medium">
                        <Activity className="h-4 w-4 text-green-500" />
                        Team Activity
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                    <div className="space-y-3">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <Skeleton key={i} className="h-14 w-full" />
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    const commits = activity as CommitActivity[] || [];

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                    <Activity className="h-4 w-4 text-green-500" />
                    Team Activity
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
                {commits.length === 0 ? (
                    <p className="text-muted-foreground text-sm text-center py-4">
                        No recent team activity
                    </p>
                ) : (
                    <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                        {commits.slice(0, 10).map((commit) => (
                            <div
                                key={commit.commitId}
                                onClick={() => handleCommitClick(commit)}
                                className="flex items-center gap-3 p-2 rounded-md hover:bg-muted cursor-pointer transition-colors"
                            >
                                <GitCommit className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                <p className="text-sm truncate flex-1">{commit.message || 'No message'}</p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground flex-shrink-0">
                                    <span className="font-medium">{commit.authorName}</span>
                                    <span>•</span>
                                    <span>{commit.repositoryName}</span>
                                    <span>•</span>
                                    <span>{formatTimeAgo(commit.committedAt)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
