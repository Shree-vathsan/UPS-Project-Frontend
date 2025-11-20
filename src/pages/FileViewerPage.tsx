import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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

const FileViewerPage: React.FC = () => {
  const navigate = useNavigate();
  const { fileName } = useParams(); // /repo/:repo/file/:fileName
  const [activeTab, setActiveTab] = useState("code");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* NAV */}
      <nav className="w-full bg-white h-16 border-b flex items-center justify-between px-6">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <div className="w-7 h-7 bg-indigo-500 rounded-md flex items-center justify-center text-white text-sm">F</div>
          Foresite
        </div>
        <button className="text-sm text-gray-700">Logout</button>
      </nav>

      {/* MAIN */}
      <main className="max-w-5xl mx-auto pt-6 px-4">

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-blue-600 flex items-center gap-1 mb-4"
        >
          ← Back to files
        </button>

        {/* Filename */}
        <h1 className="text-2xl font-semibold">{fileName}</h1>
        <p className="text-sm text-gray-500 mb-4">src/components/{fileName}</p>

        {/* Tabs */}
        <div className="flex gap-6 border-b mb-4">
          <button
            className={`pb-2 text-sm ${
              activeTab === "code"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("code")}
          >
            Code
          </button>

          <button
            className={`pb-2 text-sm ${
              activeTab === "analysis"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("analysis")}
          >
            Analysis
          </button>
        </div>

        {/* Latest commit */}
        <p className="text-sm text-gray-500 mb-2">
          Latest commit <span className="font-mono">a1b2c3d</span> by @alice (2 hours ago)
        </p>

        {/* Code viewer (dark box) */}
        {activeTab === "code" && (
          <pre className="bg-[#0d1117] text-gray-200 p-6 rounded-lg overflow-x-auto text-sm leading-relaxed border border-gray-700">
            {mockCode}
          </pre>
        )}

        {/* Analysis tab placeholder */}
        {activeTab === "analysis" && (
          <div className="bg-white border rounded-lg p-6 text-gray-700">
            AI code analysis will appear here.
          </div>
        )}

        {/* Prev / Next buttons */}
        <div className="flex justify-end gap-3 mt-4">
          <button className="px-3 py-1 border rounded-lg bg-white text-sm">
            ← Prev
          </button>

          <button className="px-3 py-1 border rounded-lg bg-white text-sm">
            Next →
          </button>
        </div>
      </main>
    </div>
  );
};

export default FileViewerPage;
