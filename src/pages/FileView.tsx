import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Code, BarChart, FileText, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { api } from '../utils/api';
import BackButton from '../components/BackButton';
import FileAnalysis from '../components/FileAnalysis';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from '@/components/theme-provider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function FileView() {
    const { fileId } = useParams<{ fileId: string }>();
    const { theme } = useTheme();
    const [file, setFile] = useState<any>(null);
    const [content, setContent] = useState<string>('');
    const [analysis, setAnalysis] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<'code' | 'analysis'>('code');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [commitHistory, setCommitHistory] = useState<any[]>([]);
    const [currentCommitSha, setCurrentCommitSha] = useState<string | null>(null);

    // Determine if current theme is light (includes black-beige which has light background)
    const isLightTheme = theme === 'light' || theme === 'light-pallete' || theme === 'black-beige';

    const getLanguageFromPath = (filePath: string): string => {
        const extension = filePath.split('.').pop()?.toLowerCase();
        const languageMap: { [key: string]: string } = {
            'js': 'javascript', 'jsx': 'jsx', 'ts': 'typescript', 'tsx': 'tsx',
            'py': 'python', 'java': 'java', 'c': 'c', 'cpp': 'cpp', 'cs': 'csharp',
            'go': 'go', 'rs': 'rust', 'rb': 'ruby', 'php': 'php', 'swift': 'swift',
            'kt': 'kotlin', 'dart': 'dart', 'html': 'html', 'css': 'css',
            'scss': 'scss', 'json': 'json', 'xml': 'xml', 'yaml': 'yaml',
            'yml': 'yaml', 'md': 'markdown', 'sql': 'sql', 'sh': 'bash', 'bash': 'bash',
        };
        return languageMap[extension || ''] || 'javascript';
    };

    useEffect(() => {
        loadFile();
    }, [fileId]);

    const loadFile = async () => {
        try {
            setLoading(true);
            setError('');

            const fileData = await fetch(`http://localhost:5000/files/${fileId}`);
            if (!fileData.ok) throw new Error('File not found');

            const file = await fileData.json();
            setFile(file);

            const analysisData = await api.getFileAnalysis(fileId!);
            setAnalysis(analysisData);

            try {
                const historyRes = await fetch(`http://localhost:5000/files/${fileId}/commits`);
                if (historyRes.ok) {
                    const history = await historyRes.json();
                    setCommitHistory(history);
                    if (history.length > 0 && !currentCommitSha) {
                        setCurrentCommitSha(history[0].sha);
                    }
                }
            } catch (e) {
                console.error('Failed to load history:', e);
            }

            await fetchContent();
        } catch (err: any) {
            console.error('Failed to load file:', err);
            setError(err.message || 'Failed to load file');
        } finally {
            setLoading(false);
        }
    };

    const fetchContent = async (sha?: string) => {
        setLoading(true);
        try {
            const params = new URLSearchParams(window.location.search);
            const branch = params.get('branch');

            let contentUrl = `http://localhost:5000/files/${fileId}/content`;

            if (sha) {
                contentUrl += `?commitSha=${sha}`;
            } else if (branch) {
                contentUrl += `?branchName=${encodeURIComponent(branch)}`;
            }

            const contentResponse = await fetch(contentUrl);
            if (contentResponse.ok) {
                const contentData = await contentResponse.json();
                setContent(contentData.content);
                if (contentData.commitSha) {
                    setCurrentCommitSha(contentData.commitSha);
                }
            } else {
                setContent('// Failed to load file content');
            }
        } catch (e) {
            console.error('Failed to fetch content:', e);
            setContent('// Failed to load file content');
        } finally {
            setLoading(false);
        }
    };

    const handlePreviousCommit = () => {
        if (!commitHistory.length) return;
        const currentIndex = currentCommitSha ? commitHistory.findIndex(c => c.sha === currentCommitSha) : -1;

        if (currentIndex === -1) {
            fetchContent(commitHistory[0].sha);
        } else if (currentIndex < commitHistory.length - 1) {
            const prevCommit = commitHistory[currentIndex + 1];
            fetchContent(prevCommit.sha);
        }
    };

    const handleNextCommit = () => {
        if (!commitHistory.length || !currentCommitSha) return;
        const currentIndex = commitHistory.findIndex(c => c.sha === currentCommitSha);
        if (currentIndex > 0) {
            const nextCommit = commitHistory[currentIndex - 1];
            fetchContent(nextCommit.sha);
        }
    };

    if (loading) {
        return (
            <div className="container-custom py-8 space-y-4">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-96 w-full" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="container-custom py-8">
                <BackButton />
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </div>
        );
    }

    if (!file) {
        return (
            <div className="container-custom py-8">
                <BackButton />
                <Card>
                    <CardContent className="py-12 text-center">
                        <h3 className="font-heading text-lg font-semibold">File not found</h3>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const currentIndex = currentCommitSha ? commitHistory.findIndex(c => c.sha === currentCommitSha) : -1;
    const canGoPrevious = (currentIndex !== -1 && currentIndex < commitHistory.length - 1) || (currentIndex === -1 && commitHistory.length > 0);
    const canGoNext = currentIndex !== -1 && currentIndex > 0;

    return (
        <div className="container-custom py-8 animate-fade-in">
            <BackButton />

            {/* Header */}
            <div className="mb-8">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                        <h1 className="font-heading text-3xl font-bold mb-2 font-mono">
                            {file?.filePath || 'Unknown file'}
                        </h1>
                        {file?.totalLines && (
                            <p className="text-muted-foreground text-sm">
                                {file.totalLines} lines
                            </p>
                        )}
                    </div>
                </div>

                {currentCommitSha && (
                    <Card>
                        <CardContent className="py-3">
                            <div className="flex items-center gap-3 text-sm">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <code className="text-primary font-mono">{currentCommitSha.substring(0, 7)}</code>
                                {commitHistory.find(c => c.sha === currentCommitSha) && (
                                    <>
                                        <span className="text-muted-foreground">•</span>
                                        <span>{commitHistory.find(c => c.sha === currentCommitSha)?.message}</span>
                                        <span className="text-muted-foreground">•</span>
                                        <span className="text-muted-foreground">
                                            {new Date(commitHistory.find(c => c.sha === currentCommitSha)?.committedAt || '').toLocaleDateString()}
                                        </span>
                                    </>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
                <TabsList className="grid w-full max-w-md grid-cols-2">
                    <TabsTrigger value="code" className="gap-2">
                        <Code className="h-4 w-4" />
                        Code View
                    </TabsTrigger>
                    <TabsTrigger value="analysis" className="gap-2">
                        <BarChart className="h-4 w-4" />
                        File Analysis
                    </TabsTrigger>
                </TabsList>

                {/* Code View Tab */}
                <TabsContent value="code" className="mt-6 space-y-4">
                    <Card>
                        <CardContent className="p-0">
                            <SyntaxHighlighter
                                language={getLanguageFromPath(file?.filePath || '')}
                                style={isLightTheme ? vs : vscDarkPlus}
                                showLineNumbers={true}
                                wrapLines={true}
                                customStyle={{
                                    background: 'transparent',
                                    margin: 0,
                                    padding: '1rem',
                                    fontSize: '13px',
                                    lineHeight: '1.6',
                                    fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
                                }}
                                codeTagProps={{
                                    style: {
                                        fontSize: '13px',
                                        fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
                                    }
                                }}
                                lineNumberStyle={{
                                    minWidth: '3em',
                                    paddingRight: '1em',
                                    color: isLightTheme ? '#666' : '#6e7681',
                                    userSelect: 'none',
                                    fontSize: '13px',
                                }}
                            >
                                {content}
                            </SyntaxHighlighter>
                        </CardContent>
                    </Card>

                    {/* Commit Navigation */}
                    <div className="flex items-center gap-3">
                        <Button
                            onClick={handlePreviousCommit}
                            disabled={!canGoPrevious}
                            variant="outline"
                            size="sm"
                            className="gap-2"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Previous Commit
                        </Button>
                        <Button
                            onClick={handleNextCommit}
                            disabled={!canGoNext}
                            variant="outline"
                            size="sm"
                            className="gap-2"
                        >
                            Next Commit
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                        {commitHistory.length > 0 && (
                            <Badge variant="secondary">
                                {currentIndex !== -1
                                    ? `Commit ${commitHistory.length - currentIndex} of ${commitHistory.length}`
                                    : 'Latest Unindexed Commit'}
                            </Badge>
                        )}
                    </div>
                </TabsContent>

                {/* File Analysis Tab */}
                <TabsContent value="analysis" className="mt-6">
                    {analysis ? (
                        <FileAnalysis file={file} analysis={analysis} />
                    ) : (
                        <Card>
                            <CardContent className="py-12 text-center">
                                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                                <h3 className="font-heading text-lg font-semibold mb-2">No Analysis Available</h3>
                                <p className="text-muted-foreground text-sm">
                                    Analysis data is not available for this file.
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
