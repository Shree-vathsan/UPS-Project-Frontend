import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Code, LogOut } from 'lucide-react';
import Dashboard from './pages/Dashboard.tsx';
import RepoView from './pages/RepoView.tsx';
import CommitView from './pages/CommitView.tsx';
import PRView from './pages/PRView.tsx';
import PullRequestView from './pages/PullRequestView.tsx';
import FileTreeView from './pages/FileTreeView.tsx';
import FileView from './pages/FileView.tsx';
import Login from './pages/Login.tsx';
import ThemeSelector from './components/ThemeSelector.tsx';
import { ThemeProvider } from './components/theme-provider.tsx';
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



    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
        setToken('');
        window.location.href = '/login';
    };

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

                            {user ? (
                                <div className="flex items-center gap-0.5 px-3 py-2 bg-card border border-border rounded-full transition-all hover:shadow-md">
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
                                    <button
                                        onClick={handleLogout}
                                        className="ml-2 px-2 py-1 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 hover:border-red-300 transition-all flex items-center gap-1"
                                    >
                                        <LogOut className="h-3 w-3" />
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => window.location.href = '/login'}
                                    className="font-medium text-sm text-foreground hover:underline"
                                >
                                    Login
                                </button>
                            )}
                        </div>
                    </div>
                </header>

                {/* Routes with fade-in animation */}
                <main className="animate-fade-in">
                    <Routes>
                        <Route path="/" element={user ? <Dashboard user={user} token={token} /> : <Login />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/repo/:repositoryId" element={user ? <RepoView user={user} /> : <Login />} />
                        <Route path="/commit/:commitId" element={<CommitView />} />
                        <Route path="/pr/:prId" element={<PRView />} />
                        <Route path="/pr/:owner/:repo/:prNumber" element={user ? <PullRequestView user={user} /> : <Login />} />
                        <Route path="/file/:fileId" element={<FileView />} />
                        <Route path="/filetree/:fileId" element={<FileTreeView />} />
                    </Routes>
                </main>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
