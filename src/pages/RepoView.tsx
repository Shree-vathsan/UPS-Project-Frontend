import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GitCommit, GitPullRequest, FolderTree, BarChart, RefreshCw, GitBranch, Clock, ArrowRight } from 'lucide-react';
import { api } from '../utils/api';
import FileTree from '../components/FileTree';
import BackButton from '../components/BackButton';
import RepositoryAnalytics from '../components/RepositoryAnalytics';
import TeamInsights from '../components/TeamInsights';
import Pagination from '../components/Pagination';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface RepoViewProps {
    user: any;
}

export default function RepoView({ user: _user }: RepoViewProps) {
    const navigate = useNavigate();
    const { repositoryId } = useParams<{ repositoryId: string }>();
    const [activeTab, setActiveTab] = useState<'commits' | 'prs' | 'files' | 'analytics'>('commits');
    const [repository, setRepository] = useState<any>(null);
    const [branches, setBranches] = useState<any[]>([]);
    const [selectedBranch, setSelectedBranch] = useState<string>('main');
    const [commits, setCommits] = useState<any[]>([]);
    const [prs, setPrs] = useState<any[]>([]);
    const [allPrs, setAllPrs] = useState<any[]>([]);
    const [prFilter, setPrFilter] = useState<'all' | 'open' | 'closed'>('all');
    const [files, setFiles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Pagination state
    const [commitsPage, setCommitsPage] = useState(1);
    const [prsPage, setPrsPage] = useState(1);
    const itemsPerPage = 10;

    // Helper to reload all data
    const loadRepoData = async () => {
        await loadRepository();
        await loadBranches();
        await loadCommits();
        await loadPRs();
        await loadFiles();
    };

    useEffect(() => {
        loadRepository();
        loadBranches();
    }, [repositoryId]);

    useEffect(() => {
        if (activeTab === 'commits') loadCommits();
        else if (activeTab === 'prs') loadPRs();
        else if (activeTab === 'files') loadFiles();
    }, [activeTab, selectedBranch]);

    useEffect(() => {
        if (allPrs.length > 0) {
            if (prFilter === 'all') {
                setPrs(allPrs);
            } else if (prFilter === 'open') {
                setPrs(allPrs.filter((pr: any) => pr.state === 'open'));
            } else if (prFilter === 'closed') {
                setPrs(allPrs.filter((pr: any) => pr.state === 'closed'));
            }
        }
    }, [prFilter, allPrs]);

    const loadRepository = async () => {
        try {
            const data = await api.getRepository(repositoryId!);
            setRepository(data);
        } catch (error) {
            console.error('Failed to load repository:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadBranches = async () => {
        try {
            const data = await fetch(`http://localhost:5000/api/repositories/${repositoryId}/branches`);
            const branches = await data.json();
            setBranches(branches);

            // Set default branch
            const defaultBranch = branches.find((b: any) => b.isDefault);
            if (defaultBranch) {
                setSelectedBranch(defaultBranch.name);
            }
        } catch (error) {
            console.error('Failed to load branches:', error);
        }
    };

    const loadCommits = async () => {
        try {
            const data = await fetch(`http://localhost:5000/api/repositories/${repositoryId}/branches/${selectedBranch}/commits`);
            const commits = await data.json();
            setCommits(commits);
        } catch (error) {
            console.error('Failed to load commits:', error);
        }
    };

    const loadPRs = async () => {
        try {
            const data = await api.getPullRequests(repositoryId!);
            setAllPrs(data);
            setPrs(data);
        } catch (error) {
            console.error('Failed to load PRs:', error);
        }
    };

    const loadFiles = async () => {
        try {
            const data = await fetch(`http://localhost:5000/api/repositories/${repositoryId}/branches/${selectedBranch}/files`);
            const files = await data.json();
            setFiles(files);
        } catch (error) {
            console.error('Failed to load files:', error);
        }
    };

    const [isRefreshing, setIsRefreshing] = useState(false);
    const [lastRefreshTime, setLastRefreshTime] = useState<string | null>(null);

    // Auto-refresh on load if stale (> 1 hour)
    useEffect(() => {
        if (repository?.lastRefreshAt) {
            setLastRefreshTime(repository.lastRefreshAt);
            const lastRefresh = new Date(repository.lastRefreshAt);
            const now = new Date();
            const diffHours = (now.getTime() - lastRefresh.getTime()) / (1000 * 60 * 60);

            if (diffHours > 1) {
                console.log("Repository is stale, triggering auto-refresh...");
                refreshRepository();
            }
        }
    }, [repository]);

    // Poll for updates when refreshing
    useEffect(() => {
        let interval: any;
        if (isRefreshing && repository) {
            interval = setInterval(async () => {
                try {
                    const res = await fetch(`http://localhost:5000/repositories/${repositoryId}`);
                    const data = await res.json();

                    // Check if timestamp updated
                    if (data.lastRefreshAt !== lastRefreshTime) {
                        setRepository(data);
                        setLastRefreshTime(data.lastRefreshAt);
                        setIsRefreshing(false);
                        // Re-fetch commits and files to show new data
                        loadRepoData();
                    }
                } catch (err) {
                    console.error("Polling error:", err);
                }
            }, 3000); // Poll every 3 seconds
        }
        return () => clearInterval(interval);
    }, [isRefreshing, lastRefreshTime, repositoryId]);

    const refreshRepository = async () => {
        if (isRefreshing || !repositoryId) return;

        setIsRefreshing(true);
        try {
            await fetch(`http://localhost:5000/repositories/${repositoryId}/refresh`, {
                method: 'POST'
            });
            // Don't set isRefreshing(false) here - wait for polling to detect the change
        } catch (err) {
            console.error("Failed to trigger refresh:", err);
            setIsRefreshing(false);
            alert("Failed to start refresh");
        }
    };

    if (loading) {
        return (
            <div className="container-custom py-8">
                <Skeleton className="h-8 w-48 mb-6" />
                <Skeleton className="h-12 w-full mb-4" />
                <Skeleton className="h-64 w-full" />
            </div>
        );
    }

    if (!repository) {
        return (
            <div className="container-custom py-8">
                <Card>
                    <CardContent className="py-12 text-center">
                        <h3 className="font-heading text-lg font-semibold">Repository not found</h3>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container-custom py-8 animate-fade-in">
            <BackButton to="/" label="Back to Dashboard" />

            {/* Repository Header */}
            <div className="mb-8">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                            <h1 className="font-heading text-3xl font-bold">
                                {repository.ownerUsername}/{repository.name}
                            </h1>
                            <Button
                                onClick={refreshRepository}
                                disabled={isRefreshing}
                                variant="outline"
                                size="sm"
                                className="gap-2"
                            >
                                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                                {isRefreshing ? 'Refreshing...' : 'Refresh'}
                            </Button>
                        </div>

                        <div className="flex items-center gap-3">
                            <Badge variant={repository.status === 'ready' ? 'success' : 'warning'}>
                                {repository.status || 'unknown'}
                            </Badge>
                            {repository.lastRefreshAt && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Clock className="h-4 w-4" />
                                    <span>Updated {new Date(repository.lastRefreshAt).toLocaleString()}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Branch Selector */}
                    {branches.length > 0 && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="gap-2">
                                    <GitBranch className="h-4 w-4" />
                                    {selectedBranch}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {branches.map((branch: any) => (
                                    <DropdownMenuItem
                                        key={branch.id}
                                        onClick={() => setSelectedBranch(branch.name)}
                                    >
                                        {branch.name} {branch.isDefault && '(default)'}
                                        {branch.name === selectedBranch && <span className="ml-auto">✓</span>}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
                <TabsList className="grid w-full max-w-2xl grid-cols-4">
                    <TabsTrigger value="commits" className="gap-2">
                        <GitCommit className="h-4 w-4" />
                        <span className="hidden sm:inline">Commits</span>
                    </TabsTrigger>
                    <TabsTrigger value="prs" className="gap-2">
                        <GitPullRequest className="h-4 w-4" />
                        <span className="hidden sm:inline">PRs</span>
                        {/* <span className="sm:hidden">{allPrs.length}</span> */}
                    </TabsTrigger>
                    <TabsTrigger value="files" className="gap-2">
                        <FolderTree className="h-4 w-4" />
                        <span className="hidden sm:inline">Files</span>
                    </TabsTrigger>
                    <TabsTrigger value="analytics" className="gap-2">
                        <BarChart className="h-4 w-4" />
                        <span className="hidden sm:inline">Analytics</span>
                    </TabsTrigger>
                </TabsList>

                {/* Commits Tab */}
                <TabsContent value="commits" className="mt-6 space-y-4">
                    <h2 className="font-heading text-xl font-semibold">
                        Commits from {selectedBranch} ({commits.length})
                    </h2>
                    {commits.length === 0 ? (
                        <Card>
                            <CardContent className="py-12 text-center">
                                <GitCommit className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                                <h3 className="font-heading text-lg font-semibold mb-2">No commits found</h3>
                                <p className="text-muted-foreground text-sm">
                                    This branch doesn't have any commits yet.
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4">
                            {commits
                                .slice((commitsPage - 1) * itemsPerPage, commitsPage * itemsPerPage)
                                .map((commit: any) => (
                                    <Card key={commit.id} className="hover-lift">
                                        <CardHeader>
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1 space-y-2">
                                                    <code className="text-xs text-primary bg-primary/10 px-2 py-1 rounded">
                                                        {commit.sha.substring(0, 7)}
                                                    </code>
                                                    <CardTitle className="text-base font-normal">
                                                        {commit.message}
                                                    </CardTitle>
                                                    <CardDescription>
                                                        {new Date(commit.committedAt).toLocaleString()}
                                                    </CardDescription>
                                                </div>
                                                <Button
                                                    onClick={() => navigate(`/commit/${commit.id}`)}
                                                    size="sm"
                                                    className="gap-2 ml-4"
                                                >
                                                    View Details
                                                    <ArrowRight className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </CardHeader>
                                    </Card>
                                ))}
                        </div>
                    )}
                    {commits.length > 0 && (
                        <Pagination
                            currentPage={commitsPage}
                            totalPages={Math.ceil(commits.length / itemsPerPage)}
                            onPageChange={setCommitsPage}
                        />
                    )}
                </TabsContent>

                {/* Pull Requests Tab */}
                <TabsContent value="prs" className="mt-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="font-heading text-xl font-semibold">
                            Pull Requests ({prs.length})
                        </h2>
                        <div className="flex gap-2">
                            <Button
                                onClick={() => setPrFilter('all')}
                                variant={prFilter === 'all' ? 'default' : 'outline'}
                                size="sm"
                            >
                                All
                            </Button>
                            <Button
                                onClick={() => setPrFilter('open')}
                                variant={prFilter === 'open' ? 'default' : 'outline'}
                                size="sm"
                            >
                                Open
                            </Button>
                            <Button
                                onClick={() => setPrFilter('closed')}
                                variant={prFilter === 'closed' ? 'default' : 'outline'}
                                size="sm"
                            >
                                Closed
                            </Button>
                        </div>
                    </div>

                    {prs.length === 0 ? (
                        <Card>
                            <CardContent className="py-12 text-center">
                                <GitPullRequest className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                                <h3 className="font-heading text-lg font-semibold mb-2">No Pull Requests Found</h3>
                                <p className="text-muted-foreground text-sm">
                                    {prFilter === 'all'
                                        ? 'No pull requests have been created for this repository yet.'
                                        : `No ${prFilter} pull requests found.`}
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4">
                            {prs
                                .slice((prsPage - 1) * itemsPerPage, prsPage * itemsPerPage)
                                .map((pr: any) => (
                                    <Card key={pr.id} className="hover-lift">
                                        <CardHeader>
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1 space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="secondary" className="text-xs">PR</Badge>
                                                        <CardTitle className="text-base">
                                                            {pr.title || `Pull Request #${pr.prNumber}`}
                                                        </CardTitle>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <code className="text-xs text-muted-foreground">
                                                            #{pr.prNumber}
                                                        </code>
                                                        <Badge variant={pr.state === 'open' ? 'success' : 'secondary'}>
                                                            {pr.state === 'open' ? 'Open' : 'Merged'}
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <Button
                                                    onClick={() => navigate(`/pr/${repository.ownerUsername}/${repository.name}/${pr.prNumber}`)}
                                                    size="sm"
                                                    className="gap-2 ml-4"
                                                >
                                                    View PR
                                                    <ArrowRight className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </CardHeader>
                                    </Card>
                                ))}
                        </div>
                    )}
                    {prs.length > 0 && (
                        <Pagination
                            currentPage={prsPage}
                            totalPages={Math.ceil(prs.length / itemsPerPage)}
                            onPageChange={setPrsPage}
                        />
                    )}
                </TabsContent>

                {/* Files Tab */}
                <TabsContent value="files" className="mt-6 space-y-4">
                    <h2 className="font-heading text-xl font-semibold">
                        File Structure ({selectedBranch} branch)
                    </h2>
                    {files.length === 0 ? (
                        <Card>
                            <CardContent className="py-12 text-center">
                                <FolderTree className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                                <h3 className="font-heading text-lg font-semibold mb-2">No files found</h3>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card>
                            <CardContent className="pt-6">
                                <FileTree
                                    files={files}
                                    onFileClick={(fileId) => navigate(`/file/${fileId}?branch=${encodeURIComponent(selectedBranch)}`)}
                                />
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                {/* Analytics Tab */}
                <TabsContent value="analytics" className="mt-6 space-y-8">
                    <div>
                        <h2 className="font-heading text-2xl font-semibold mb-6">Repository Analytics</h2>
                        <RepositoryAnalytics repositoryId={repositoryId!} />
                    </div>

                    <div>
                        <h2 className="font-heading text-2xl font-semibold mb-6">Team Insights</h2>
                        <TeamInsights repositoryId={repositoryId!} />
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
