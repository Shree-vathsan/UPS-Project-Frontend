import { useEffect, useState } from 'react';
import { Package, BarChart, Plus, Loader, RefreshCw, AlertTriangle, Search } from 'lucide-react';
import { api } from '../utils/api';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import Pagination from '../components/Pagination';

interface DashboardProps {
    user: any;
    token: string;
}

type TabType = 'your' | 'analyzed' | 'add';
type FilterType = 'your' | 'others' | 'all';

export default function Dashboard({ user, token }: DashboardProps) {
    // Tab state
    const [activeTab, setActiveTab] = useState<TabType>('your');

    // Your repositories tab state
    const [repos, setRepos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [analyzing, setAnalyzing] = useState<Set<string>>(new Set());
    const [checkingStatus, setCheckingStatus] = useState<Set<string>>(new Set());

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    // Search state
    const [searchQuery, setSearchQuery] = useState('');

    // Analyzed repositories tab state
    const [analyzedRepos, setAnalyzedRepos] = useState<any[]>([]);
    const [analyzedFilter, setAnalyzedFilter] = useState<FilterType>('all');
    const [loadingAnalyzed, setLoadingAnalyzed] = useState(false);
    const [analyzedError, setAnalyzedError] = useState<string>('');

    // Add repository tab state
    const [repoUrl, setRepoUrl] = useState('');
    const [addingRepo, setAddingRepo] = useState(false);
    const [addError, setAddError] = useState<string>('');
    const [addSuccess, setAddSuccess] = useState<string>('');

    useEffect(() => {
        loadRepositories();
    }, [user?.id]);

    // Remove dependency on currentPage for fetching
    // useEffect(() => {
    //    loadRepositories();
    // }, [currentPage]);

    useEffect(() => {
        if (activeTab === 'analyzed') {
            loadAnalyzedRepositories();
        }
    }, [activeTab, analyzedFilter, user?.id]);

    const loadRepositories = async () => {
        setLoading(true);
        try {
            // Fetch ALL repositories by paginating through all pages
            const { data } = await api.getAllRepositories(token, user.id);
            console.log('Repositories from GitHub:', data);

            setRepos(Array.isArray(data) ? data : []);
            // setTotalPages is no longer needed as we calculate it from repos.length

            setError('');
        } catch (err: any) {
            console.error('Failed to load repositories:', err);
            setError(err.message || 'Failed to load repositories from GitHub');
            setRepos([]);
        } finally {
            setLoading(false);
        }
    };

    const loadAnalyzedRepositories = async () => {
        setLoadingAnalyzed(true);
        setAnalyzedError('');
        try {
            const data = await api.getAnalyzedRepositories(user.id, analyzedFilter);
            setAnalyzedRepos(Array.isArray(data) ? data : []);
        } catch (err: any) {
            console.error('Failed to load analyzed repositories:', err);
            setAnalyzedError(err.message || 'Failed to load analyzed repositories');
            setAnalyzedRepos([]);
        } finally {
            setLoadingAnalyzed(false);
        }
    };

    const handleAnalyze = async (owner: string, name: string) => {
        const key = `${owner}/${name}`;
        setAnalyzing(prev => new Set(prev).add(key));

        try {
            const result = await api.analyzeRepository(owner, name, user.id);
            console.log('Analysis result:', result);

            // Handle different response types
            if (result.alreadyHasAccess) {
                // User already has access
                alert(`Repository Access\n\nYou already have access to this repository!`);
                setActiveTab('analyzed');
                await loadAnalyzedRepositories();
            } else if (result.accessGranted) {
                // Repository was analyzed by someone else, access granted
                const message = result.message || `Repository was analyzed by${result.analyzedBy ? ' ' + result.analyzedBy : ' another user'}. Access granted!`;
                alert(`Access Granted\n\n${message}\n\nYou can now view this repository in the "Analyzed Repository" tab.`);
                setActiveTab('analyzed');
                await loadAnalyzedRepositories();
            } else if (result.newAnalysis) {
                // New analysis started
                alert(`Analysis Started\n\nAnalysis started for ${owner}/${name}!\n\nThis will take a few minutes. Check the "Analyzed Repository" tab to see the status.`);
                await loadRepositories();
            } else {
                // Fallback for any other response
                alert(`Analysis Started\n\nAnalysis started for ${owner}/${name}!`);
            }
        } catch (error: any) {
            console.error('Analysis failed:', error);
            alert(`Failed to Analyze\n\nFailed to analyze ${owner}/${name}\n\n${error.message}`);
        } finally {
            setAnalyzing(prev => {
                const newSet = new Set(prev);
                newSet.delete(key);
                return newSet;
            });
        }
    };

    const handleViewAnalysis = async (owner: string, name: string) => {
        const key = `${owner}/${name}`;
        setCheckingStatus(prev => new Set(prev).add(key));

        try {
            const status = await api.getRepositoryStatus(owner, name);
            console.log('Repository status:', status);

            if (!status.analyzed) {
                alert('Repository Not Analyzed\n\nThis repository has not been analyzed yet. Click "Analyze" first!');
                return;
            }

            if (status.status === 'ready') {
                window.location.href = `/repo/${status.repositoryId}`;
            } else if (status.status === 'analyzing') {
                alert('Analysis in Progress\n\nAnalysis is still in progress. Please wait a few minutes and try again.');
            } else if (status.status === 'pending') {
                alert('Analysis Queued\n\nAnalysis is queued and will start soon.');
            } else {
                alert(`Repository Status\n\nCurrent status: ${status.status}`);
            }
        } catch (error: any) {
            console.error('Failed to check status:', error);
            alert(`Status Check Failed\n\n${error.message}`);
        } finally {
            setCheckingStatus(prev => {
                const newSet = new Set(prev);
                newSet.delete(key);
                return newSet;
            });
        }
    };

    const handleAddRepository = async () => {
        if (!repoUrl.trim()) {
            setAddError('Please enter a GitHub repository URL');
            return;
        }

        setAddingRepo(true);
        setAddError('');
        setAddSuccess('');

        try {
            const result = await api.analyzeRepositoryByUrl(repoUrl.trim(), user.id);

            // Handle different response types
            if (result.alreadyHasAccess) {
                // User already has access
                alert('Repository Access\n\nYou already have access to this repository!\n\nNavigating to the "Analyzed Repository" tab.');
                setActiveTab('analyzed');
                setRepoUrl('');
            } else if (result.accessGranted) {
                // Repository was analyzed by someone else, access granted
                const timeAgoText = result.analyzedBy ? ` by ${result.analyzedBy}` : '';
                alert(`Access Granted\n\nRepository was already analyzed${timeAgoText}. Access granted!\n\nNavigating to the "Analyzed Repository" tab.`);
                setActiveTab('analyzed');
                setRepoUrl('');
            } else if (result.newAnalysis) {
                // New analysis started
                setAddSuccess(`Successfully started analysis for the repository!\n\nAnalysis will take a few minutes. Switch to the "Analyzed Repository" tab to see the progress.`);
                setRepoUrl('');
                // Refresh analyzed repos
                if (activeTab !== 'analyzed') {
                    setTimeout(() => setActiveTab('analyzed'), 2000);
                }
            } else if (result.alreadyExists) {
                // Legacy handling for old backend responses
                if (result.status === 'ready') {
                    alert('Repository Already Analyzed\n\nThis repository has already been analyzed. You can view it in the "Analyzed Repository" tab.');
                    setActiveTab('analyzed');
                } else {
                    alert('Analysis in Progress\n\nThis repository is already being analyzed. Check the "Analyzed Repository" tab for status updates.');
                    setActiveTab('analyzed');
                }
            } else {
                // Fallback
                setAddSuccess(`Successfully started analysis for the repository!`);
                setRepoUrl('');
            }
        } catch (error: any) {
            console.error('Failed to add repository:', error);
            setAddError(error.message || 'Failed to add repository');
        } finally {
            setAddingRepo(false);
        }
    };

    return (
        <div className="container-custom py-8 animate-fade-in">
            <div className="mb-8">
                <h1 className="font-heading text-3xl font-bold mb-2">Repository Management</h1>
                <p className="text-muted-foreground">
                    Analyze repositories, track progress, and view insights
                </p>
            </div>

            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabType)}>
                <TabsList className="grid w-full max-w-md grid-cols-3">
                    <TabsTrigger value="your" className="gap-2">
                        <Package className="h-4 w-4" />
                        <span className="hidden sm:inline">Your Repositories</span>
                        <span className="sm:hidden">Your</span>
                    </TabsTrigger>
                    <TabsTrigger value="analyzed" className="gap-2" loading={loadingAnalyzed}>
                        <BarChart className="h-4 w-4" />
                        <span className="hidden sm:inline">Analyzed</span>
                        <span className="sm:hidden">Analyzed</span>
                    </TabsTrigger>
                    <TabsTrigger value="add" className="gap-2">
                        <Plus className="h-4 w-4" />
                        <span className="hidden sm:inline">Add Repository</span>
                        <span className="sm:hidden">Add</span>
                    </TabsTrigger>
                </TabsList>

                {/* Your Repositories Tab */}
                <TabsContent value="your" className="mt-6 space-y-4">
                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <Card key={i}>
                                    <CardHeader>
                                        <Skeleton className="h-6 w-3/4" />
                                        <Skeleton className="h-4 w-full mt-2" />
                                    </CardHeader>
                                </Card>
                            ))}
                        </div>
                    ) : error ? (
                        <Alert variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>Error Loading Repositories</AlertTitle>
                            <AlertDescription>
                                {error}
                                <div className="mt-4">
                                    <Button onClick={loadRepositories} variant="outline" size="sm">
                                        <RefreshCw className="h-4 w-4 mr-2" />
                                        Try Again
                                    </Button>
                                </div>
                            </AlertDescription>
                        </Alert>
                    ) : repos.length === 0 ? (
                        <Card>
                            <CardContent className="py-12 text-center">
                                <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                                <h3 className="font-heading text-lg font-semibold mb-2">No repositories found</h3>
                                <p className="text-muted-foreground text-sm">
                                    Create a repository on GitHub to get started!
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <h2 className="font-heading text-xl font-semibold">Your Repositories</h2>
                                    <Badge>{repos.length}</Badge>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <input
                                            type="text"
                                            placeholder="Search repositories..."
                                            value={searchQuery}
                                            onChange={(e) => {
                                                setSearchQuery(e.target.value);
                                                setCurrentPage(1); // Reset to first page on search
                                            }}
                                            className="pl-9 pr-4 py-2 text-sm border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200 hover:shadow-[0_0_10px_rgba(255,255,255,0.3)] w-[200px]"
                                        />
                                    </div>
                                    <Button onClick={loadRepositories} variant="outline" size="sm">
                                        <RefreshCw className="h-4 w-4 mr-2" />
                                        Refresh
                                    </Button>
                                </div>
                            </div>

                            <div className="grid gap-4">
                                {repos
                                    .filter((repo: any) => {
                                        if (!searchQuery.trim()) return true;
                                        const query = searchQuery.toLowerCase();
                                        const repoName = `${repo.login}/${repo.name}`.toLowerCase();
                                        const description = (repo.description || '').toLowerCase();
                                        return repoName.includes(query) || description.includes(query);
                                    })
                                    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                                    .map((repo: any) => {
                                        const key = `${repo.login}/${repo.name}`;
                                        const isAnalyzing = analyzing.has(key);
                                        const isCheckingStatus = checkingStatus.has(key);
                                        const isAnalyzed = repo.analyzed === true;
                                        const status = repo.status;

                                        return (
                                            <Card key={repo.id} className="hover-lift">
                                                <CardHeader>
                                                    <div className="flex items-start justify-between">
                                                        <div className="space-y-1 flex-1">
                                                            <CardTitle className="text-lg">
                                                                {repo.login}/{repo.name}
                                                            </CardTitle>
                                                            <CardDescription>
                                                                {repo.description || 'No description'}
                                                            </CardDescription>
                                                            {isAnalyzed && (
                                                                <div className="mt-2">
                                                                    {status === 'ready' && (
                                                                        <Badge variant="success">Analysis Complete</Badge>
                                                                    )}
                                                                    {status === 'analyzing' && (
                                                                        <Badge variant="warning">Analyzing...</Badge>
                                                                    )}
                                                                    {status === 'pending' && (
                                                                        <Badge variant="info">Pending</Badge>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="ml-4">
                                                            {isAnalyzing ? (
                                                                <Button disabled size="sm">
                                                                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                                                                    Starting...
                                                                </Button>
                                                            ) : !isAnalyzed ? (
                                                                <Button onClick={() => handleAnalyze(repo.login, repo.name)} size="sm">
                                                                    Analyze
                                                                </Button>
                                                            ) : isCheckingStatus ? (
                                                                <Button disabled variant="outline" size="sm">
                                                                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                                                                    Checking...
                                                                </Button>
                                                            ) : status === 'ready' ? (
                                                                <Button onClick={() => handleViewAnalysis(repo.login, repo.name)} size="sm">
                                                                    View Analysis
                                                                </Button>
                                                            ) : (
                                                                <Button onClick={() => handleViewAnalysis(repo.login, repo.name)} variant="outline" size="sm">
                                                                    Check Status
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </CardHeader>
                                            </Card>
                                        );
                                    })}
                            </div>

                            {(() => {
                                const filteredRepos = repos.filter((repo: any) => {
                                    if (!searchQuery.trim()) return true;
                                    const query = searchQuery.toLowerCase();
                                    const repoName = `${repo.login}/${repo.name}`.toLowerCase();
                                    const description = (repo.description || '').toLowerCase();
                                    return repoName.includes(query) || description.includes(query);
                                });
                                return filteredRepos.length > 0 ? (
                                    <Pagination
                                        currentPage={currentPage}
                                        onPageChange={setCurrentPage}
                                        totalPages={Math.ceil(filteredRepos.length / itemsPerPage)}
                                        disabled={loading}
                                    />
                                ) : null;
                            })()}

                            <Card className="mt-6">
                                <CardContent className="py-4">
                                    <h4 className="font-medium mb-2">How it works:</h4>
                                    <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                                        <li>Repositories are fetched from your GitHub account</li>
                                        <li>Click "Analyze" to clone and analyze a repository</li>
                                        <li>Analysis includes: Git history parsing, semantic embeddings, and ownership calculation</li>
                                        <li>Click "View Analysis" when ready to see detailed insights</li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </>
                    )}
                </TabsContent>

                {/* Analyzed Repositories Tab */}
                <TabsContent value="analyzed" className="mt-6 space-y-4">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-heading text-xl font-semibold">Analyzed Repositories</h2>
                        <Button onClick={loadAnalyzedRepositories} variant="outline" size="sm">
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Refresh
                        </Button>
                    </div>

                    <div className="flex gap-2 mb-4">
                        <Button
                            onClick={() => setAnalyzedFilter('all')}
                            variant={analyzedFilter === 'all' ? 'default' : 'outline'}
                            size="sm"
                        >
                            All
                        </Button>
                        <Button
                            onClick={() => setAnalyzedFilter('your')}
                            variant={analyzedFilter === 'your' ? 'default' : 'outline'}
                            size="sm"
                        >
                            Your
                        </Button>
                        <Button
                            onClick={() => setAnalyzedFilter('others')}
                            variant={analyzedFilter === 'others' ? 'default' : 'outline'}
                            size="sm"
                        >
                            Others
                        </Button>
                    </div>

                    {loadingAnalyzed ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <Card key={i}>
                                    <CardHeader>
                                        <Skeleton className="h-6 w-3/4" />
                                        <Skeleton className="h-4 w-1/2 mt-2" />
                                    </CardHeader>
                                </Card>
                            ))}
                        </div>
                    ) : analyzedError ? (
                        <Alert variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{analyzedError}</AlertDescription>
                        </Alert>
                    ) : analyzedRepos.length === 0 ? (
                        <Card>
                            <CardContent className="py-12 text-center">
                                <BarChart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                                <h3 className="font-heading text-lg font-semibold mb-2">No Analyzed Repositories</h3>
                                <p className="text-muted-foreground text-sm mb-4">
                                    {analyzedFilter === 'your'
                                        ? "You haven't analyzed any repositories yet."
                                        : analyzedFilter === 'others'
                                            ? 'No repositories from other users have been added.'
                                            : 'No repositories have been analyzed yet.'}
                                </p>
                                <p className="text-muted-foreground text-xs">
                                    {analyzedFilter === 'your'
                                        ? 'Go to "Your Repository" tab and click "Analyze" on a repository.'
                                        : 'Go to "Add Repository" tab to add a repository from another user.'}
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4">
                            {analyzedRepos.map((repo: any) => (
                                <Card key={repo.id} className="hover-lift">
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-2 flex-1">
                                                <CardTitle className="text-lg">
                                                    {repo.ownerUsername}/{repo.name}
                                                </CardTitle>
                                                <div className="flex gap-2">
                                                    <Badge variant={repo.isMine ? 'success' : 'info'}>
                                                        {repo.label}
                                                    </Badge>
                                                    <Badge variant={
                                                        repo.status === 'ready' ? 'success' :
                                                            repo.status === 'analyzing' ? 'warning' : 'secondary'
                                                    }>
                                                        {repo.status === 'ready' ? 'Ready' :
                                                            repo.status === 'analyzing' ? 'Analyzing' : repo.status}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <Button
                                                onClick={() => {
                                                    if (repo.status === 'ready') {
                                                        window.location.href = `/repo/${repo.id}`;
                                                    } else if (repo.status === 'analyzing') {
                                                        alert('Analysis in Progress\n\nThis repository is still being analyzed. Please check back in a few minutes.');
                                                    } else {
                                                        alert(`Repository Status\n\nCurrent status: ${repo.status}`);
                                                    }
                                                }}
                                                disabled={repo.status !== 'ready'}
                                                size="sm"
                                            >
                                                {repo.status === 'ready' ? 'View Details' :
                                                    repo.status === 'analyzing' ? 'Analyzing...' : 'Pending'}
                                            </Button>
                                        </div>
                                    </CardHeader>
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>

                {/* Add Repository Tab */}
                <TabsContent value="add" className="mt-6">
                    <div className="max-w-2xl mx-auto">
                        <Card>
                            <CardHeader className="text-center">
                                <Plus className="h-12 w-12 mx-auto mb-4 text-primary" />
                                <CardTitle>Add Repository to Analyze</CardTitle>
                                <CardDescription>
                                    Add any public GitHub repository to analyze, even if the owner hasn't logged in to this platform.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium mb-2 block">
                                        GitHub Repository URL
                                    </label>
                                    <Input
                                        value={repoUrl}
                                        onChange={(e) => setRepoUrl(e.target.value)}
                                        placeholder="https://github.com/owner/repo"
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter' && !addingRepo) {
                                                handleAddRepository();
                                            }
                                        }}
                                    />
                                </div>

                                <Button
                                    onClick={handleAddRepository}
                                    disabled={addingRepo || !repoUrl.trim()}
                                    className="w-full"
                                    size="lg"
                                >
                                    {addingRepo ? (
                                        <>
                                            <Loader className="h-4 w-4 mr-2 animate-spin" />
                                            Analyzing...
                                        </>
                                    ) : (
                                        'Analyze Repository'
                                    )}
                                </Button>

                                {addError && (
                                    <Alert variant="destructive">
                                        <AlertTriangle className="h-4 w-4" />
                                        <AlertTitle>Error</AlertTitle>
                                        <AlertDescription>{addError}</AlertDescription>
                                    </Alert>
                                )}

                                {addSuccess && (
                                    <Alert variant="success">
                                        <AlertTitle>Success</AlertTitle>
                                        <AlertDescription>{addSuccess}</AlertDescription>
                                    </Alert>
                                )}

                                <Alert variant="info">
                                    <AlertTitle>Supported URL Formats:</AlertTitle>
                                    <AlertDescription>
                                        <ul className="text-xs space-y-1 list-disc list-inside mt-2">
                                            <li><code>https://github.com/owner/repo</code></li>
                                            <li><code>https://github.com/owner/repo.git</code></li>
                                            <li><code>github.com/owner/repo</code></li>
                                            <li><code>owner/repo</code></li>
                                        </ul>
                                        <p className="text-xs mt-2">
                                            <strong>Note:</strong> Only public repositories can be analyzed. Private repositories require the owner to log in.
                                        </p>
                                    </AlertDescription>
                                </Alert>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
