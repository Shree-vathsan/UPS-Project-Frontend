import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DarkModeToggle from "./DarkModeToggle";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  showTabs?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, title, showTabs = true }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Top Navbar */}
      <nav className="sticky top-0 z-50 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 h-16 flex items-center justify-between px-6 transition-all duration-300">
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => navigate("/repos")}
        >
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-sm group-hover:bg-indigo-700 transition-colors">
            F
          </div>
          <span className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">Foresite</span>
        </div>
        <div className="flex items-center gap-4">
          <DarkModeToggle />
          <button
            className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors px-3 py-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
            onClick={() => navigate("/")}
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto pt-8 px-6 pb-12">
        {title && <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 tracking-tight">{title}</h1>}

        {showTabs && (
          <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-800 pb-0 mb-8">
            <TabButton
              active={isActive("/repos")}
              onClick={() => navigate("/repos")}
            >
              Your Repositories
            </TabButton>
            <TabButton
              active={isActive("/analyzed")}
              onClick={() => navigate("/analyzed")}
            >
              Analyzed Repositories
            </TabButton>
            <TabButton
              active={isActive("/add-repository")}
              onClick={() => navigate("/add-repository")}
            >
              + Add Repository
            </TabButton>
          </div>
        )}

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {children}
        </div>
      </main>
    </div>
  );
};

const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`
      px-4 py-2.5 text-sm font-medium rounded-t-lg transition-all duration-200 relative
      ${active
        ? "text-indigo-600 dark:text-indigo-400 bg-white dark:bg-gray-900 border-x border-t border-gray-200 dark:border-gray-800 -mb-px z-10"
        : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
      }
    `}
  >
    {children}
    {active && <div className="absolute top-0 left-0 w-full h-0.5 bg-indigo-600 dark:bg-indigo-500 rounded-t-lg" />}
  </button>
);

export default Layout;
