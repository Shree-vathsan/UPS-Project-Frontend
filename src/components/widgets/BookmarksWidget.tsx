import { useNavigate } from 'react-router-dom';
import { Bookmark, FileText, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useBookmarks, useRemoveBookmark } from '../../hooks/useApiQueries';

interface BookmarksWidgetProps {
    userId: string;
}

interface BookmarkedFile {
    fileId: string;
    filePath: string;
    fileName: string;
    repositoryId: string;
    repositoryName: string;
    ownerUsername: string;
    category: string | null;
    createdAt: string;
}

export default function BookmarksWidget({ userId }: BookmarksWidgetProps) {
    const navigate = useNavigate();
    const { data: bookmarks, isLoading } = useBookmarks(userId);
    const removeBookmark = useRemoveBookmark();

    const handleFileClick = (file: BookmarkedFile) => {
        navigate(`/file/${file.fileId}`);
    };

    const handleRemove = (e: React.MouseEvent, fileId: string) => {
        e.stopPropagation();
        removeBookmark.mutate({ userId, fileId });
    };

    if (isLoading) {
        return (
            <Card className="h-full">
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-sm font-medium">
                        <Bookmark className="h-4 w-4 text-yellow-500" />
                        Bookmarks
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

    const files = bookmarks as BookmarkedFile[] || [];

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                    <Bookmark className="h-4 w-4 text-yellow-500" />
                    Bookmarks
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
                {files.length === 0 ? (
                    <p className="text-muted-foreground text-sm text-center py-4">
                        No bookmarked files. Star files for quick access!
                    </p>
                ) : (
                    <div className="space-y-1 h-64 overflow-y-auto pr-1">
                        {files.slice(0, 30).map((file) => (
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
                                        {file.repositoryName}
                                    </p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                                    onClick={(e) => handleRemove(e, file.fileId)}
                                >
                                    <Trash2 className="h-3 w-3 text-destructive" />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
