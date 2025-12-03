import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { Btn } from "../components/Button";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, dracula, atomDark, ghcolors, vs, nightOwl } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Back } from "../components/Back";
import { TabNavigation } from "../components/TabNavigation";
import { PageHeader } from "../components/PageHeader";

// Fake code content (replace later with real API)
const mockCode = `
import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export const Button = ({
  children,
  onClick,
  variant = 'primary'
}: ButtonProps) => {

  const baseStyle = 'px-4 py-2 rounded-lg font-medium';
  const variantStyle = variant === 'primary'
    ? 'bg-blue-600 text-white'
    : 'bg-gray-200 text-gray-800';

  return (
    <button
      onClick={onClick}
      className={\`\${baseStyle} \${variantStyle}\`}
    >
      {children}
    </button>
  );
};
`;

const themes = {
  "VS Code Dark": vscDarkPlus,
  "Dracula": dracula,
  "Atom Dark": atomDark,
  "Night Owl": nightOwl,
  "GitHub Light": ghcolors,
  "VS Code Light": vs
};

const FileViewerPage: React.FC = () => {
  const { fileName } = useParams(); // /repo/:repo/file/:fileName
  const [activeTab, setActiveTab] = useState("code");
  const [selectedTheme, setSelectedTheme] = useState<keyof typeof themes>("VS Code Dark");

  return (
    <Layout showTabs={false}>
      {/* Header */}
      <PageHeader
        title={fileName || 'File'}
        description={`src/components/${fileName}`}
      />

      {/* Tabs */}
      <TabNavigation
        tabs={[
          { id: 'code', label: 'Code' },
          { id: 'analysis', label: 'AI Analysis' }
        ]}
        activeTab={activeTab}
        onTabChange={(id) => setActiveTab(id)}
      />

      {/* Latest commit & Navigation */}
      <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Latest commit <span className="font-mono font-medium text-gray-800 dark:text-gray-100">a1b2c3d</span> by <span className="font-medium text-gray-800 dark:text-gray-100">@alice</span> (2 hours ago)
        </p>

        <div className="flex gap-2">
          <Btn variant="secondary" className="!py-1 !px-3 !text-xs" onClick={() => { }}>
            ← Prev
          </Btn>
          <Btn variant="secondary" className="!py-1 !px-3 !text-xs" onClick={() => { }}>
            Next →
          </Btn>
        </div>
      </div>

      {/* Code viewer (dark box) */}
      {activeTab === "code" && (
        <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm relative group">
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <select
              value={selectedTheme}
              onChange={(e) => setSelectedTheme(e.target.value as keyof typeof themes)}
              className="text-xs border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 backdrop-blur-sm cursor-pointer shadow-sm"
            >
              {Object.keys(themes).map((themeName) => (
                <option key={themeName} value={themeName}>
                  {themeName}
                </option>
              ))}
            </select>
          </div>
          <SyntaxHighlighter
            language="typescript"
            style={themes[selectedTheme]}
            customStyle={{ margin: 0, padding: '1.5rem', fontSize: '0.875rem', lineHeight: '1.5' }}
            showLineNumbers={true}
            wrapLines={true}
          >
            {mockCode}
          </SyntaxHighlighter>
        </div>
      )}

      {/* Analysis tab placeholder */}
      {activeTab === "analysis" && (
        <div className="space-y-6">
          {/* File Purpose */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 shadow-sm dark:shadow-none">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-pink-500 dark:text-pink-400">📄</span>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">File Purpose</h3>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Semantic summary will be generated from embeddings</p>
          </div>

          {/* Code Ownership */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 shadow-sm dark:shadow-none">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-purple-500 dark:text-purple-400">👥</span>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Code Ownership</h3>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Ownership data will be populated after multi-author analysis</p>
          </div>

          {/* Dependency Graph */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 shadow-sm dark:shadow-none">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-blue-500 dark:text-blue-400">🕸️</span>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Dependency Graph</h3>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Interactive visualization of the dependencies and dependents</p>

            <div className="relative h-64 bg-gray-50 dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden flex items-center justify-center">
              {/* Simplified Graph Visualization */}
              <div className="relative w-full h-full p-8 flex items-center justify-center">
                {/* Center Node */}
                <div className="absolute z-10 bg-blue-600 text-white text-[10px] px-3 py-1.5 rounded shadow-lg border border-blue-500 dark:border-blue-400">
                  Table.jsx
                </div>

                {/* Left Node (Import) */}
                <div className="absolute left-1/4 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-[10px] px-2 py-1 rounded border border-gray-200 dark:border-gray-700 shadow-sm">
                  react
                </div>
                {/* Line to Left */}
                <div className="absolute left-1/4 top-1/2 w-1/4 h-[1px] bg-gray-300 dark:bg-gray-700"></div>

                {/* Right Nodes (Dependents) */}
                <div className="absolute right-1/4 top-1/3 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-[10px] px-2 py-1 rounded border border-gray-200 dark:border-gray-700 shadow-sm">
                  App.tsx
                </div>
                <div className="absolute right-1/4 top-1/2 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-[10px] px-2 py-1 rounded border border-gray-200 dark:border-gray-700 shadow-sm">
                  Layout.tsx
                </div>
                <div className="absolute right-1/4 top-2/3 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-[10px] px-2 py-1 rounded border border-gray-200 dark:border-gray-700 shadow-sm">
                  RepoCard.tsx
                </div>

                {/* Lines to Right */}
                <div className="absolute right-1/4 top-1/2 w-1/4 h-[1px] bg-gray-300 dark:bg-gray-700"></div>
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <line x1="50%" y1="50%" x2="75%" y2="33%" stroke="currentColor" className="text-gray-300 dark:text-gray-700" strokeWidth="1" />
                  <line x1="50%" y1="50%" x2="75%" y2="66%" stroke="currentColor" className="text-gray-300 dark:text-gray-700" strokeWidth="1" />
                </svg>

                {/* Legend */}
                <div className="absolute top-4 left-4 bg-white/80 dark:bg-gray-900/80 p-2 rounded border border-gray-200 dark:border-gray-800 text-[10px] backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 bg-green-500 rounded-sm"></div>
                    <span className="text-gray-600 dark:text-gray-400">Dependencies (Imports)</span>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 bg-orange-500 rounded-sm"></div>
                    <span className="text-gray-600 dark:text-gray-400">Dependents (Imported by)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-sm"></div>
                    <span className="text-gray-600 dark:text-gray-400">Current File</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Semantically Similar Files */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 shadow-sm dark:shadow-none">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-pink-500 dark:text-pink-400">🧠</span>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Semantically Similar Files</h3>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Files with similar code patterns (based on AI embeddings)</p>

            <div className="space-y-2">
              {[
                "src/components/ui/Table.jsx",
                "src/components/ui/Table.tsx",
                "src/components/ui/Table.js",
                "src/components/ui/Table.ts",
                "src/pages/Notifications.tsx"
              ].map((file, i) => (
                <div key={i} className="bg-gray-50 dark:bg-gray-950/50 px-3 py-2 rounded border border-gray-200 dark:border-gray-800 text-xs text-blue-600 dark:text-blue-400 font-mono hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors">
                  {file}
                </div>
              ))}
            </div>
          </div>

          {/* Change History */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 shadow-sm dark:shadow-none">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-gray-400">📅</span>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Change History</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-2">
                <span className="text-gray-500 dark:text-gray-400">Total Changes:</span>
                <span className="text-gray-900 dark:text-white font-mono">1</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-2">
                <span className="text-gray-500 dark:text-gray-400">Most Active Author:</span>
                <span className="text-gray-900 dark:text-white font-mono">N/A</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 dark:text-gray-400">Last Modified:</span>
                <span className="text-gray-900 dark:text-white font-mono">6/6/2025</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default FileViewerPage;
