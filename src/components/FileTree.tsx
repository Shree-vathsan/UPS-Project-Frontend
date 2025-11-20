import React from "react";
import FileTreeItem from "../components/FileTreeItem";
import type { FileNode } from "../pages/RepositoryDetailsPage";

type Props = {
  nodes: FileNode[];
};

const FileTree: React.FC<Props> = ({ nodes }) => {
  return (
    <ul className="space-y-1">
      {nodes.map((n) => (
        <FileTreeItem key={n.path ?? n.name} node={n} level={0} />
      ))}
    </ul>
  );
};

export default FileTree;
