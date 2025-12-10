import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { FileNode } from "../pages/RepositoryDetailsPage";

type Props = {
  node: FileNode;
  level: number;
};

const FileTreeItem: React.FC<Props> = ({ node, level }) => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const { repoName } = useParams();

  const isFolder = node.type === "folder";
  const indent = level * 16; // indentation spacing

  const handleClick = () => {
    if (isFolder) {
      setOpen((v) => !v);
    } else {
      navigate(`/repo/${repoName}/file/${node.name}`);
    }
  };

  return (
    <li>
      {/* Row */}
      <div
        className="flex items-center gap-3 py-1.5 px-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-md cursor-pointer select-none transition-colors"
        style={{ marginLeft: indent }}
        onClick={handleClick}
      >
        {/* Arrow Only for Folders */}
        {isFolder ? (
          <svg
            className={`w-3 h-3 text-gray-500 dark:text-gray-400 transform transition-transform ${open ? "rotate-90" : ""
              }`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M6 4l6 6-6 6" />
          </svg>
        ) : (
          <span className="w-3 h-3" /> // alignment space for files
        )}

        {/* Icon */}
        {isFolder ? (
          <svg
            className="w-4 h-4 text-gray-500 dark:text-gray-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path d="M3 7a2 2 0 012-2h4l2 2h6a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
          </svg>
        ) : (
          <svg
            className="w-4 h-4 text-gray-500 dark:text-gray-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
          </svg>
        )}

        {/* Name */}
        <span
          className={`text-sm ${isFolder
              ? "text-gray-700 dark:text-gray-200 font-medium"
              : "text-blue-600 dark:text-blue-400 hover:underline"
            }`}
        >
          {node.name}
        </span>
      </div>

      {/* Folder children */}
      {isFolder && open && node.children && (
        <ul className="mt-1">
          {node.children.map((child) => (
            <FileTreeItem
              key={child.path ?? child.name}
              node={child}
              level={level + 1}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

export default FileTreeItem;
