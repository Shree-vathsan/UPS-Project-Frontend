import { useNavigate } from 'react-router-dom';
import { Clock, FileText, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useRecentFiles } from '../../hooks/useApiQueries';

interface RecentFilesWidgetProps {
    userId: string;
}

interface RecentFile {
    fileId: string;
    filePath: string;
    fileName: string;
    repositoryId: string;
    repositoryName: string;
    ownerUsername: string;
    viewedAt: string;
}

export default function RecentFilesWidget({ userId }: RecentFilesWidgetProps) {
    const navigate = useNavigate();
    const { data: recentFiles, isLoading } = useRecentFiles(userId);

    const handleFileClick = (file: RecentFile) => {
        navigate(`/file/${file.fileId}`);
    };

    const formatTimeAgo = (date: string) => {
        const diff = Date.now() - new Date(date).getTime();
        const minutes = Math.floor(diff / (1000 * 60));
        if (minutes < 1) return 'just now';
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    };

    if (isLoading) {
        return (
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-sm font-medium">
                        <Clock className="h-4 w-4 text-primary" />
                        Recent Files
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                    <div className="space-y-2">
                        {[1, 2, 3, 4, 5].map(i => (
                            <Skeleton key={i} className="h-12 w-full" />
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    const files = recentFiles as RecentFile[] || [];

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                    <Clock className="h-4 w-4 text-primary" />
                    Recent Files
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
                {files.length === 0 ? (
                    <p className="text-muted-foreground text-sm text-center py-4">
                        No recent files. Start exploring repositories!
                    </p>
                ) : (
                    <div className="space-y-1 h-64 overflow-y-auto pr-1">
                        {files.slice(0, 10).map((file) => (
                            <div
                                key={file.fileId}
                                onClick={() => handleFileClick(file)}
                                className="flex items-center gap-3 p-2 rounded-md hover:bg-muted cursor-pointer transition-colors group"
                            >
                                <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">
                                        {file.fileName}
                                    </p>
                                    <p className="text-xs text-muted-foreground truncate">
                                        {file.repositoryName} • {formatTimeAgo(file.viewedAt)}
                                    </p>
                                </div>
                                <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
