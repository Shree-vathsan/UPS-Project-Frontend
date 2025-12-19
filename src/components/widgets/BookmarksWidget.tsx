import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Bookmark, FileText, ExternalLink, MoreVertical } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/components/theme-provider';
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
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
    const { theme } = useTheme();

    const handleFileClick = (file: BookmarkedFile) => {
        navigate(`/file/${file.fileId}`);
    };

    const handleRemove = (e: React.MouseEvent, fileId: string) => {
        e.stopPropagation();
        removeBookmark.mutate({ userId, fileId });
        setOpenDropdownId(null);
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
                        {files.slice(0, 30).map((file) => {
                            const isDropdownOpen = openDropdownId === file.fileId;
                            return (
                                <div
                                    key={file.fileId}
                                    className={`flex items-center gap-3 p-2 rounded-md transition-colors group ${isDropdownOpen ? 'bg-muted' : 'hover:bg-muted'
                                        }`}
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
                                        className={`h-6 w-6 transition-opacity flex-shrink-0 ${theme === 'night' ? 'hover:bg-primary/40' : theme === 'dark' ? 'hover:bg-blue-500/30' : theme === 'light' ? 'hover:bg-blue-100' : ''} ${isDropdownOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                                            }`}
                                        onClick={() => handleFileClick(file)}
                                    >
                                        <ExternalLink className="h-3 w-3 text-muted-foreground" />
                                    </Button>
                                    <DropdownMenu
                                        modal={false}
                                        onOpenChange={(open) => setOpenDropdownId(open ? file.fileId : null)}
                                    >
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className={`h-6 w-6 transition-opacity flex-shrink-0 ${theme === 'night' ? 'hover:bg-primary/40' : theme === 'dark' ? 'hover:bg-blue-500/30' : theme === 'light' ? 'hover:bg-blue-100' : ''} ${isDropdownOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                                                    }`}
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <MoreVertical className="h-3 w-3" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem
                                                className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                                                onClick={(e) => handleRemove(e, file.fileId)}
                                            >
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            );
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
