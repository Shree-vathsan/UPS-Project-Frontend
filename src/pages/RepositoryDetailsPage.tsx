import React, { useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FileTree from "../components/FileTree";
import { Btn } from "../components/Button";

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

  // Memoize repo
  const repo = useMemo(() => state?.repo, [state?.repo]);

  // Memoize file tree
  const fileTree = useMemo(() => {
    return state?.fileTree ?? [];
  }, [state?.fileTree]);

//   // Memoize code snippet
//   const codeSnippet = useMemo(() => {
//     return state?.codeSnippet ?? "";
//   }, [state?.codeSnippet]);

  // Redirect if opened manually without state
  useEffect(() => {
    if (!repo) {
      navigate("/repos", { replace: true });
    }
  }, [repo, navigate]);

  if (!repo) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top navbar */}
      <nav className="w-full bg-white h-16 border-b flex items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-indigo-500 rounded-md flex items-center justify-center text-white text-sm">
            F
          </div>
          <span className="font-semibold">Foresite</span>
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
                className="w-5 h-5 text-gray-700"
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
              className="text-blue-600 underline text-sm mb-2"
              onClick={() => navigate("/repos")}
            >
              ← Back to repositories
            </button>

            <h1 className="text-2xl font-semibold">{repo.name}</h1>
            {repo.description && (
              <p className="text-sm text-gray-500 mt-1">{repo.description}</p>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-white border px-3 py-2 rounded-lg text-sm shadow-sm">
              {repo.default_branch ?? "main"}
            </div>
          </div>
        </header>

        {/* File Structure */}
        <section>
          <h3 className="text-sm text-gray-600 mb-3">File Structure</h3>
          <div className="bg-white border rounded-lg p-4 shadow-sm">
            {fileTree.length > 0 ? (
              <FileTree nodes={fileTree} />
            ) : (
              <p className="text-gray-500 text-sm">No files available.</p>
            )}
          </div>
        </section>

        {/* Code Snippet Section */}
        {/* <section className="mt-10">
          <h3 className="text-sm text-gray-600 mb-3">Sample Code</h3>

          <pre className="bg-black text-green-400 p-4 rounded-lg text-sm overflow-x-auto shadow-inner whitespace-pre-wrap leading-6">
{codeSnippet}
          </pre>
        </section> */}
      </main>
    </div>
  );
};

export default RepositoryDetailsPage;
