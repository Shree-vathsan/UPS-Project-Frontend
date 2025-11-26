import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FileTree from "../components/FileTree";
import { Btn } from "../components/Button";
import PullRequestList from "../components/PullRequestList";
import CommitList from "../components/CommitList";

// Types used across the page
export type FileNode = {
  name: string;
  type: "file" | "folder";
  path?: string;
  children?: FileNode[];
};

export type RepoMeta = {
  id?: number;
  name: string;
  description?: string;
  default_branch?: string;
  owner?: { login: string; avatar_url?: string };
};

type LocationState = {
  repo?: RepoMeta;
  fileTree?: FileNode[];
  codeSnippet?: string;
};

const RepositoryDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;
  const [activeTab, setActiveTab] = useState<'commits' | 'pull-requests' | 'files'>('commits');

  // Memoize repo
  const repo = useMemo(() => state?.repo, [state?.repo]);

  // Memoize file tree
  const fileTree = useMemo(() => {
    return state?.fileTree ?? [];
  }, [state?.fileTree]);

  // Redirect if opened manually without state
  useEffect(() => {
    if (!repo) {
      navigate("/repos", { replace: true });
    }
  }, [repo, navigate]);

  if (!repo) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Top navbar */}
      <nav className="w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-16 flex items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-indigo-500 rounded-md flex items-center justify-center text-white text-sm">
            F
          </div>
          <span className="font-semibold text-gray-900 dark:text-white">Foresite</span>
        </div>

        <div className="flex items-center gap-4">
          <Btn variant="secondary" onClick={() => navigate("/repos")}>
            Back to repositories
          </Btn>

          {/* GitHub avatar */}
          <div className="w-8 h-8 rounded-full border flex items-center justify-center overflow-hidden">
            {repo.owner?.avatar_url ? (
              <img
                src={repo.owner.avatar_url}
                className="w-full h-full object-cover"
                alt="avatar"
              />
            ) : (
              <svg
                viewBox="0 0 16 16"
                fill="currentColor"
                className="w-5 h-5 text-gray-700 dark:text-gray-300"
              >
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59..." />
              </svg>
            )}
          </div>
        </div>
      </nav>

      {/* Main Layout */}
      <main className="max-w-6xl mx-auto pt-8 px-6">
        {/* Header */}
        <header className="flex items-start justify-between gap-6 mb-6">
          <div>
            <button
              className="text-blue-600 dark:text-blue-400 underline text-sm mb-2"
              onClick={() => navigate("/repos")}
            >
              ← Back to repositories
            </button>

            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{repo.name}</h1>
            {repo.description && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{repo.description}</p>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 px-3 py-2 rounded-lg text-sm shadow-sm text-gray-700 dark:text-gray-300">
              {repo.default_branch ?? "main"}
            </div>
          </div>
        </header>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-gray-200 dark:border-gray-800 mb-6">
          <button
            className={`pb-2 text-sm font-medium transition-colors ${activeTab === 'commits'
              ? "text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              }`}
            onClick={() => setActiveTab('commits')}
          >
            Commits
          </button>
          <button
            className={`pb-2 text-sm font-medium transition-colors ${activeTab === 'pull-requests'
              ? "text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              }`}
            onClick={() => setActiveTab('pull-requests')}
          >
            Pull Requests (11)
          </button>
          <button
            className={`pb-2 text-sm font-medium transition-colors ${activeTab === 'files'
              ? "text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              }`}
            onClick={() => setActiveTab('files')}
          >
            File Structure
          </button>
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {activeTab === 'commits' && (
            <CommitList />
          )}

          {activeTab === 'pull-requests' && (
            <PullRequestList />
          )}

          {activeTab === 'files' && (
            <section>
              <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-3">File Structure</h3>
              <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-4 shadow-sm">
                {fileTree.length > 0 ? (
                  <FileTree nodes={fileTree} />
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">No files available.</p>
                )}
              </div>
            </section>
          )}
        </div>

      </main>
    </div>
  );
};

export default RepositoryDetailsPage;
