import React, { useState } from "react";
import type { FileNode } from "../pages/RepositoryDetailsPage";
// import { ChevronRightIcon, FolderIcon, DocumentTextIcon } from "@heroicons/react/24/outline"; 
// If you don't have heroicons installed, replace icons with inline SVGs or existing icons.

type Props = {
  node: FileNode;
  level: number;
};

const FileTreeItem: React.FC<Props> = ({ node, level }) => {
  const [open, setOpen] = useState(true);
  const indent = level * 16;

  if (node.type === "folder") {
    return (
      <li>
        <div
          className="flex items-center gap-3 py-2 px-3 hover:bg-gray-50 rounded-md cursor-pointer select-none"
          onClick={() => setOpen((v) => !v)}
          style={{ marginLeft: indent }}
        >
          <span className="w-4 h-4 flex items-center">
            {/* chevron rotates when open */}
            <svg
              className={`w-3 h-3 transform ${open ? "rotate-90" : ""}`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M6 4l6 6-6 6" />
            </svg>
          </span>
          <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M3 7a2 2 0 012-2h4l2 2h6a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
          </svg>
          <span className="text-sm text-gray-700">{node.name}</span>
        </div>

        {open && node.children && node.children.length > 0 && (
          <ul className="mt-1">
            {node.children.map((child) => (
              <FileTreeItem key={child.path ?? child.name} node={child} level={level + 1} />
            ))}
          </ul>
        )}
      </li>
    );
  }

  // file
  return (
    <li>
      <div
        className="flex items-center gap-3 py-2 px-3 hover:bg-gray-50 rounded-md cursor-pointer select-none"
        style={{ marginLeft: indent }}
        onClick={() => {
          // open file preview or route to file content page later
          // For now we simply console log
          console.log("Open file:", node.path ?? node.name);
        }}
      >
        <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        </svg>
        <span className="text-sm text-blue-600">{node.name}</span>
      </div>
    </li>
  );
};

export default FileTreeItem;
