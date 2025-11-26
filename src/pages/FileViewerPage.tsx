import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { Btn } from "../components/Button";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, dracula, atomDark, ghcolors, vs, nightOwl } from 'react-syntax-highlighter/dist/esm/styles/prism';

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
  const navigate = useNavigate();
  const { fileName } = useParams(); // /repo/:repo/file/:fileName
  const [activeTab, setActiveTab] = useState("code");
  const [selectedTheme, setSelectedTheme] = useState<keyof typeof themes>("VS Code Dark");

  return (
    <Layout showTabs={false}>
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-indigo-600 dark:text-indigo-400 flex items-center gap-1 mb-4 hover:underline"
      >
        ← Back to files
      </button>

      {/* Filename */}
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight mb-2">{fileName}</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">src/components/{fileName}</p>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-gray-200 dark:border-gray-800 mb-6">
        <button
          className={`pb-2 text-sm font-medium transition-colors ${activeTab === "code"
            ? "text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400"
            : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            }`}
          onClick={() => setActiveTab("code")}
        >
          Code
        </button>

        <button
          className={`pb-2 text-sm font-medium transition-colors ${activeTab === "analysis"
            ? "text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400"
            : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            }`}
          onClick={() => setActiveTab("analysis")}
        >
          Analysis
        </button>
      </div>

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
        <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl p-8 text-center text-gray-500 dark:text-gray-400">
          <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-3 text-indigo-600 dark:text-indigo-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">AI Code Analysis</h3>
          <p className="mt-1">Select a block of code to generate an explanation.</p>
        </div>
      )}
    </Layout>
  );
};

export default FileViewerPage;
