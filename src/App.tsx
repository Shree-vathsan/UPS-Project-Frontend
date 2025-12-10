import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Github, Code, AlertTriangle, CheckCircle } from 'lucide-react';
import Dashboard from './pages/Dashboard.tsx';
import RepoView from './pages/RepoView.tsx';
import CommitView from './pages/CommitView.tsx';
import PRView from './pages/PRView.tsx';
import PullRequestView from './pages/PullRequestView.tsx';
import FileTreeView from './pages/FileTreeView.tsx';
import FileView from './pages/FileView.tsx';
import ThemeSelector from './components/ThemeSelector.tsx';
import { ThemeProvider } from './components/theme-provider.tsx';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { api } from './utils/api';

function App() {
    const [user, setUser] = useState<any>(null);
    const [token, setToken] = useState<string>('');
    const [error, setError] = useState<string>('');

    useEffect(() => {
        // Check for OAuth callback
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');

        if (code && !user) {
            api.githubCallback(code)
                .then(data => {
                    if (data && data.user && data.accessToken) {
                        setUser(data.user);
                        setToken(data.accessToken);
                        localStorage.setItem('user', JSON.stringify(data.user));
                        localStorage.setItem('token', data.accessToken);
                        window.history.replaceState({}, '', '/');
                        setError('');
                    } else {
                        setError('Invalid response from server');
                    }
                })
                .catch(err => {
                    console.error('OAuth callback error:', err);
                    setError('Authentication failed. Backend may not be running or database is not configured.');
                    // Clear the code from URL
                    window.history.replaceState({}, '', '/');
                });
        } else {
            const savedUser = localStorage.getItem('user');
            const savedToken = localStorage.getItem('token');
            if (savedUser && savedToken && savedUser !== 'undefined' && savedToken !== 'undefined') {
                try {
                    setUser(JSON.parse(savedUser));
                    setToken(savedToken);
                } catch (e) {
                    // Clear invalid localStorage
                    localStorage.removeItem('user');
                    localStorage.removeItem('token');
                }
            }
        }
    }, []);

    const handleLogin = async () => {
        try {
            const result = await api.githubLogin(window.location.origin);
            if (result && result.url) {
                window.location.href = result.url;
            } else {
                setError('Failed to get OAuth URL from backend');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Backend is not responding. Make sure the backend is running on port 5000.');
        }
    };

    if (!user) {
        return (
            <ThemeProvider defaultTheme="black-beige">
                <div className="min-h-screen flex items-center justify-center bg-background">
                    {/* Theme Selector - Top Right */}
                    <div className="absolute top-4 right-4 z-10">
                        <ThemeSelector />
                    </div>

                    <div className="w-full max-w-md px-4 animate-fade-in">
                        {/* Logo/Title */}
                        <div className="text-center mb-8">
                            <div className="flex items-center justify-center gap-3 mb-3">
                                <Code className="h-10 w-10 text-primary" />
                                <h1 className="font-heading text-4xl font-bold text-foreground">
                                    CodeFamily
                                </h1>
                            </div>
                            <p className="text-muted-foreground text-base">
                                AI-Powered Engineering Intelligence Platform
                            </p>
                        </div>

                        {/* Login Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Welcome Back</CardTitle>
                                <CardDescription>
                                    Sign in with your GitHub account to continue
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {error && (
                                    <Alert variant="destructive">
                                        <AlertTriangle className="h-4 w-4" />
                                        <AlertTitle>Authentication Error</AlertTitle>
                                        <AlertDescription>
                                            {error}
                                            <div className="mt-3 text-xs bg-background/50 p-3 rounded-md border border-border">
                                                <strong className="block mb-2">Troubleshooting:</strong>
                                                <ul className="list-disc list-inside space-y-1">
                                                    <li>Make sure backend is running: <code>dotnet run</code></li>
                                                    <li>Backend should be at: http://localhost:5000</li>
                                                    <li>Supabase database must be configured</li>
                                                </ul>
                                            </div>
                                        </AlertDescription>
                                    </Alert>
                                )}

                                <Button
                                    onClick={handleLogin}
                                    className="w-full gap-2"
                                    size="lg"
                                >
                                    <Github className="h-5 w-5" />
                                    Login with GitHub
                                </Button>

                                <div className="bg-muted/50 p-4 rounded-md border border-border">
                                    <div className="text-sm font-medium text-foreground mb-2">
                                        System Status
                                    </div>
                                    <div className="space-y-1 text-sm">
                                        <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                                            <CheckCircle className="h-4 w-4" />
                                            <span>Frontend: Running</span>
                                        </div>
                                        <div className={`flex items-center gap-2 ${error ? 'text-destructive' : 'text-muted-foreground'}`}>
                                            {error ? <AlertTriangle className="h-4 w-4" /> : <span className="h-4 w-4">...</span>}
                                            <span>Backend: {error ? 'Not responding' : 'Checking...'}</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </ThemeProvider>
        );
    }

    return (
        <ThemeProvider defaultTheme="black-beige">
            <BrowserRouter>
                {/* Modern Header */}
                <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <div className="container-custom flex h-16 items-center justify-between">
                        {/* Logo */}
                        <button
                            onClick={() => window.location.href = '/'}
                            className="flex items-center gap-2 transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md"
                        >
                            <Code className="h-6 w-6 text-primary" />
                            <span className="font-heading text-xl font-bold text-foreground">
                                ForeSite
                            </span>
                        </button>

                        {/* User Info + Theme Selector */}
                        <div className="flex items-center gap-4">
                            <ThemeSelector />

                            <div className="flex items-center gap-3 px-3 py-2 bg-card border border-border rounded-full transition-all hover:shadow-md">
                                {user.avatarUrl && (
                                    <img
                                        src={user.avatarUrl}
                                        alt={user.username}
                                        className="w-8 h-8 rounded-full border-2 border-primary"
                                    />
                                )}
                                <span className="font-medium text-sm text-foreground">
                                    {user.username}
                                </span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Routes with fade-in animation */}
                <main className="animate-fade-in">
                    <Routes>
                        <Route path="/" element={<Dashboard user={user} token={token} />} />
                        <Route path="/repo/:repositoryId" element={<RepoView user={user} />} />
                        <Route path="/commit/:commitId" element={<CommitView />} />
                        <Route path="/pr/:prId" element={<PRView />} />
                        <Route path="/pr/:owner/:repo/:prNumber" element={<PullRequestView user={user} />} />
                        <Route path="/file/:fileId" element={<FileView />} />
                        <Route path="/filetree/:fileId" element={<FileTreeView />} />
                    </Routes>
                </main>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
