import React from "react";
import { useNavigate, useParams } from "react-router-dom";

// Temporary mock file structure (replace with GitHub API later)
const mockStructure = [
  {
    type: "folder",
    name: "src",
    children: [
      {
        type: "folder",
        name: "components",
        children: [
          { type: "file", name: "Button.tsx" },
          { type: "file", name: "Modal.tsx" },
        ],
      },
      {
        type: "folder",
        name: "hooks",
        children: [
          { type: "file", name: "App.tsx" },
        ],
      },
    ],
  },
  { type: "file", name: "package.json" },
  { type: "file", name: "README.md" },
];

// Icon helper
const FileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
      d="M19.5 14.25v-2.625a2.625 2.625 0 00-2.625-2.625h-9.75A2.625 2.625 0 004.5 11.625v7.5A2.625 2.625 0 007.125 21.75h4.875" />
  </svg>
);

const FolderIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
      d="M3 7.5a1.5 1.5 0 011.5-1.5h4.379a1.5 1.5 0 011.06.44l1.122 1.12a1.5 1.5 0 001.06.44H19.5A1.5 1.5 0 0121 9V18a1.5 1.5 0 01-1.5 1.5h-15A1.5 1.5 0 013 18V7.5z" />
  </svg>
);

// Recursive renderer for files + folders
const RenderTree = ({ structure, level = 0 }) => {
  return (
    <div className={`pl-${level * 4} py-1`}>
      {structure.map((item, i) => (
        <div key={i} className="mb-1">
          <div className="flex items-center gap-2 text-gray-700 text-sm">
            {item.type === "folder" ? <FolderIcon /> : <FileIcon />}
            {item.name}
          </div>

          {item.children && (
            <RenderTree structure={item.children} level={level + 1} />
          )}
        </div>
      ))}
    </div>
  );
};

const RepoDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { repoName } = useParams(); // later this comes from URL

  return (
    <div className="min-h-screen bg-gray-50">
      {/* NAVBAR */}
      <nav className="w-full bg-white h-16 border-b flex items-center justify-between px-6">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <div className="w-7 h-7 bg-indigo-500 rounded-md flex items-center justify-center text-white text-sm">F</div>
          Foresite
        </div>

        <button className="text-sm text-gray-700">Logout</button>
      </nav>

      {/* MAIN CONTENT */}
      <main className="max-w-5xl mx-auto pt-6 px-4">

        {/* Back link */}
        <button
          onClick={() => navigate("/repos")}
          className="text-sm text-blue-600 flex items-center gap-1 mb-4"
        >
          ← Back to repositories
        </button>

        {/* Repo name */}
        <h1 className="text-2xl font-semibold mb-4">{repoName}</h1>

        {/* File Structure Box */}
        <div className="bg-white border rounded-xl p-4">
          <h2 className="font-semibold text-gray-700 mb-3">File Structure</h2>

          <RenderTree structure={mockStructure} />
        </div>
      </main>
    </div>
  );
};

export default RepoDetailPage;
