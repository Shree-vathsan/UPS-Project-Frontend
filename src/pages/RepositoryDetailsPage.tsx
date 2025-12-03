import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FileTree from "../components/FileTree";
import PullRequestList from "../components/PullRequestList";
import CommitList from "../components/CommitList";

import { Avatar } from "../components/Avatar";
import { TabNavigation } from "../components/TabNavigation";
import { PageHeader } from "../components/PageHeader";
import RepoAnalysis from "../components/RepoAnalysis/RepoAnalysis";

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
  activeTab?: "commits" | "pull-requests" | "files";
};

const RepositoryDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;

  const [activeTab, setActiveTab] = useState<
    "commits" | "pull-requests" | "files" | "analysis"
  >(() => state?.activeTab ?? "commits");


  // Memoize repo
  const repo = useMemo(() => state?.repo, [state?.repo]);

  // Memoize file tree
  const fileTree = useMemo(() => {
    return state?.fileTree ?? [];
  }, [state?.fileTree]);

  // Redirect if opened without proper state
  useEffect(() => {
    if (!repo) {
      navigate("/repos", { replace: true });
    }
  }, [repo, navigate]);

  if (!repo) return null;

  // Handle tab change and update history state
  const handleTabChange = (tabId: string) => {
    const tab = tabId as "commits" | "pull-requests" | "files";
    setActiveTab(tab);
    // Update the current history entry with the new active tab
    navigate(".", {
      replace: true,
      state: { ...state, activeTab: tab }
    });
  };

  useEffect(() => {
    if (state?.activeTab) {
      setActiveTab(state.activeTab);
    }
  }, [state?.activeTab]);


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">

      {/* Top navbar */}
      <nav className="w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-16 flex items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-indigo-500 rounded-md flex items-center justify-center text-white text-sm">
            F
          </div>
          <span className="font-semibold text-gray-900 dark:text-white">
            Foresite
          </span>
        </div>

        <div className="flex items-center gap-4">


          {/* GitHub avatar */}
          <Avatar src={repo.owner?.avatar_url} alt="avatar" />
        </div>
      </nav>

      {/* Main Layout */}
      <main className="max-w-6xl mx-auto pt-8 px-6">

        {/* Header */}
        <PageHeader
          title={repo.name}
          description={repo.description}
          backTo="/repos"
        >
          <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 px-3 py-2 rounded-lg text-sm shadow-sm text-gray-700 dark:text-gray-300">
            {repo.default_branch ?? "main"}
          </div>
        </PageHeader>

        {/* Tabs */}
        <TabNavigation
          tabs={[
            { id: 'commits', label: 'Commits' },
            { id: 'pull-requests', label: 'Pull Requests (11)' },
            { id: 'files', label: 'File Structure' },
            { id: 'analysis', label: 'Analysis' }
          ]}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />

        {/* Tab Content */}
        <div className="min-h-[400px]">

          {/* COMMITS */}
          {activeTab === "commits" && (
            <CommitList />
          )}

          {/* PULL REQUESTS */}
          {activeTab === "pull-requests" && (
            <PullRequestList />
          )}

          {/* FILE STRUCTURE */}
          {activeTab === "files" && (
            <section>
              <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                File Structure
              </h3>

              <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-4 shadow-sm">
                {fileTree.length > 0 ? (
                  <FileTree nodes={fileTree} />
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    No files available.
                  </p>
                )}
              </div>
            </section>
          )}

          {activeTab === 'analysis' && (
            <RepoAnalysis />
          )}
        </div>
      </main>
    </div>
  );
};

export default RepositoryDetailsPage;
