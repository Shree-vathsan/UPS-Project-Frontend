import { BrowserRouter, Routes, Route, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { Code, LogOut } from 'lucide-react';
import Snowfall from 'react-snowfall';
import Dashboard from './pages/Dashboard.tsx';
import RepoView from './pages/RepoView.tsx';
import CommitView from './pages/CommitView.tsx';
import PRView from './pages/PRView.tsx';
import PullRequestView from './pages/PullRequestView.tsx';
import FileTreeView from './pages/FileTreeView.tsx';
import FileView from './pages/FileView.tsx';
import Login from './pages/Login.tsx';
import ThemeSelector from './components/ThemeSelector.tsx';
import SnowfallToggle from './components/SnowfallToggle.tsx';
import NotificationBell from './components/NotificationBell.tsx';
import { ThemeProvider, useTheme } from './components/theme-provider.tsx';
import { api } from './utils/api';

// Capture OAuth code IMMEDIATELY and persist in sessionStorage
// This survives HMR (Hot Module Reload) and page refreshes
const urlParams = new URLSearchParams(window.location.search);
const codeFromUrl = urlParams.get('code');

// If there's a code in URL, save it and clear URL
if (codeFromUrl) {
    sessionStorage.setItem('oauth_code', codeFromUrl);
    window.history.replaceState({}, '', '/');
}

// Get the code from sessionStorage (works even after HMR clears the URL)
const capturedOAuthCode = sessionStorage.getItem('oauth_code');


interface AppContentProps {
    snowfallEnabled: boolean;
    toggleSnowfall: () => void;
}

// Inner component that can use useNavigate (must be inside BrowserRouter)
function AppContent({ snowfallEnabled, toggleSnowfall }: AppContentProps) {
    const navigate = useNavigate();
    const { theme: currentTheme } = useTheme();
    const [user, setUser] = useState<any>(null);
    const [token, setToken] = useState<string>('');
    // Initialize isAuthenticating to true if there's a captured OAuth code
    const [isAuthenticating, setIsAuthenticating] = useState(!!capturedOAuthCode);
    const [isInitialized, setIsInitialized] = useState(false);
    const oauthProcessed = useRef(false);

    useEffect(() => {
        // Use the OAuth code captured at module load (URL is already cleared)
        const code = capturedOAuthCode;

        if (code && !user && !oauthProcessed.current) {
            // Mark as processed IMMEDIATELY to prevent duplicate calls
            oauthProcessed.current = true;
            setIsAuthenticating(true);

            api.githubCallback(code)
                .then(data => {
                    if (data && data.user && data.accessToken) {
                        setUser(data.user);
                        setToken(data.accessToken);
                        localStorage.setItem('user', JSON.stringify(data.user));
                        localStorage.setItem('token', data.accessToken);
                    } else {
                        // Try to recover from localStorage
                        loadFromLocalStorage();
                    }
                })
                .catch(err => {
                    console.error('OAuth callback error:', err);
                    // Try to recover from localStorage
                    loadFromLocalStorage();
                })
                .finally(() => {
                    // Clear the OAuth code from sessionStorage after processing
                    sessionStorage.removeItem('oauth_code');
                    setIsAuthenticating(false);
                    setIsInitialized(true);
                });
        } else if (!code) {
            loadFromLocalStorage();
            setIsInitialized(true);
        } else {
            setIsInitialized(true);
        }
    }, []);

    const loadFromLocalStorage = () => {
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
        setIsInitialized(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
        setToken('');
        navigate('/login');
    };

    // Loading screen component
    const LoadingScreen = ({ message }: { message: string }) => (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">{message}</p>
            </div>
        </div>
    );

    return (
        <>
            {/* Modern Header */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container-custom flex h-16 items-center justify-between">
                    {/* Logo - using Link for smooth navigation */}
                    <Link
                        to="/"
                        className="flex items-center gap-2 transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md"
                    >
                        <Code className="h-6 w-6 text-primary" />
                        <span className="font-heading text-xl font-bold text-foreground">
                            ForeSite
                        </span>
                    </Link>

                    {/* User Info + Snowfall Toggle + Theme Selector + Notifications */}
                    <div className="flex items-center gap-4">
                        <SnowfallToggle isActive={snowfallEnabled} onToggle={toggleSnowfall} />
                        <ThemeSelector />

                        {user && <NotificationBell />}

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
                                    className={`ml-2 px-2 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1 ${currentTheme === 'light'
                                        ? 'text-red-600 bg-red-50 border border-red-200 hover:bg-red-100 hover:border-red-300'
                                        : currentTheme === 'dark'
                                            ? 'text-red-400 bg-red-950/30 border border-red-800/50 hover:bg-red-950/50 hover:border-red-700'
                                            : currentTheme === 'night'
                                                ? 'text-orange-400 bg-orange-950/20 border border-orange-800/40 hover:bg-orange-950/40 hover:border-orange-700'
                                                : 'text-red-600 bg-red-50 border border-red-200 hover:bg-red-100 hover:border-red-300'
                                        }`}
                                >
                                    <LogOut className="h-3 w-3" />
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="font-medium text-sm text-foreground hover:underline"
                            >
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            {/* Routes with fade-in animation */}
            <main className="animate-fade-in">
                <Routes>
                    <Route path="/" element={
                        (() => {
                            if (isAuthenticating) {
                                return <LoadingScreen message="Authenticating..." />;
                            }

                            if (!isInitialized) {
                                return <LoadingScreen message="Loading..." />;
                            }

                            return user ? <Dashboard user={user} token={token} /> : <Login />;
                        })()
                    } />
                    <Route path="/login" element={<Login />} />
                    <Route path="/repo/:repositoryId" element={user ? <RepoView user={user} /> : <Login />} />
                    <Route path="/commit/:commitId" element={<CommitView />} />
                    <Route path="/pr/:prId" element={<PRView />} />
                    <Route path="/pr/:owner/:repo/:prNumber" element={user ? <PullRequestView user={user} /> : <Login />} />
                    <Route path="/file/:fileId" element={<FileView />} />
                    <Route path="/filetree/:fileId" element={<FileTreeView />} />
                </Routes>
            </main>
        </>
    );
}

function App() {
    // Snowfall state - persisted in localStorage, default to true (on)
    const [snowfallEnabled, setSnowfallEnabled] = useState<boolean>(() => {
        const saved = localStorage.getItem('snowfall-enabled');
        return saved !== null ? saved === 'true' : true;
    });

    const toggleSnowfall = () => {
        setSnowfallEnabled(prev => {
            const newValue = !prev;
            localStorage.setItem('snowfall-enabled', String(newValue));
            return newValue;
        });
    };

    return (
        <ThemeProvider defaultTheme="black-beige">
            {snowfallEnabled && (
                <Snowfall
                    snowflakeCount={200}
                    speed={[0.5, 3.0]}
                    wind={[-0.5, 2.0]}
                    radius={[0.5, 3.0]}
                    style={{
                        position: 'fixed',
                        width: '100vw',
                        height: '100vh',
                        zIndex: 9999,
                        pointerEvents: 'none'
                    }}
                />
            )}
            <BrowserRouter>
                <AppContent snowfallEnabled={snowfallEnabled} toggleSnowfall={toggleSnowfall} />
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
