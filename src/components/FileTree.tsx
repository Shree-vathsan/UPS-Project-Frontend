import { useState } from 'react';
import { Folder, FolderOpen, File, FileText, FileJson, FileCode } from 'lucide-react';

interface FileNode {
    name: string;
    path: string;
    isDirectory: boolean;
    children?: FileNode[];
    id?: string;
    totalLines?: number;
}

interface FileTreeProps {
    files: any[];
    onFileClick: (fileId: string) => void;
}

export default function FileTree({ files, onFileClick }: FileTreeProps) {
    const buildTree = (fileList: any[]): FileNode[] => {
        const root: FileNode[] = [];
        const nodeMap: { [key: string]: FileNode } = {};

        const sortedFiles = [...fileList].sort((a, b) =>
            a.filePath.localeCompare(b.filePath)
        );

        sortedFiles.forEach(file => {
            const parts = file.filePath.split('/');
            let currentPath = '';

            parts.forEach((part: string, index: number) => {
                const isLastPart = index === parts.length - 1;
                const previousPath = currentPath;
                currentPath = currentPath ? `${currentPath}/${part}` : part;

                if (!nodeMap[currentPath]) {
                    const node: FileNode = {
                        name: part,
                        path: currentPath,
                        isDirectory: !isLastPart,
                        children: isLastPart ? undefined : [],
                        id: isLastPart ? file.id : undefined,
                        totalLines: isLastPart ? file.totalLines : undefined
                    };

                    nodeMap[currentPath] = node;

                    if (previousPath) {
                        const parent = nodeMap[previousPath];
                        if (parent && parent.children) {
                            parent.children.push(node);
                        }
                    } else {
                        root.push(node);
                    }
                }
            });
        });

        return root;
    };

    const tree = buildTree(files);

    return (
        <div className="font-mono text-sm">
            {tree.map((node, index) => (
                <TreeNode
                    key={index}
                    node={node}
                    onFileClick={onFileClick}
                    level={0}
                />
            ))}
        </div>
    );
}

interface TreeNodeProps {
    node: FileNode;
    onFileClick: (fileId: string) => void;
    level: number;
}

function TreeNode({ node, onFileClick, level }: TreeNodeProps) {
    const [isExpanded, setIsExpanded] = useState(level < 2);

    const handleClick = () => {
        if (node.isDirectory) {
            setIsExpanded(!isExpanded);
        } else if (node.id) {
            onFileClick(node.id);
        }
    };

    const getIcon = () => {
        if (node.isDirectory) {
            return isExpanded ?
                <FolderOpen className="h-4 w-4 text-primary" /> :
                <Folder className="h-4 w-4 text-primary" />;
        }

        const ext = node.name.split('.').pop()?.toLowerCase();
        const iconClass = "h-4 w-4 text-muted-foreground";

        if (['json'].includes(ext || '')) return <FileJson className={iconClass} />;
        if (['md', 'txt'].includes(ext || '')) return <FileText className={iconClass} />;
        if (['js', 'jsx', 'ts', 'tsx', 'py', 'java', 'go', 'rs', 'rb', 'php', 'c', 'cpp', 'cs'].includes(ext || '')) {
            return <FileCode className={iconClass} />;
        }
        return <File className={iconClass} />;
    };

    return (
        <div>
            <div
                onClick={handleClick}
                className="flex items-center gap-2 px-3 py-1.5 cursor-pointer hover:bg-muted/50 rounded transition-colors select-none"
                style={{ paddingLeft: `${level * 1.25 + 0.75}rem` }}
            >
                {/* Expand/Collapse Arrow */}
                {node.isDirectory && (
                    <span className="text-xs text-muted-foreground w-3">
                        {isExpanded ? '▼' : '▶'}
                    </span>
                )}
                {!node.isDirectory && (
                    <span className="w-3" />
                )}

                {/* Icon */}
                {getIcon()}

                {/* Name */}
                <span className={`flex-1 ${node.isDirectory ? 'text-primary font-semibold' : 'text-foreground'}`}>
                    {node.name}
                </span>

                {/* File info */}
                {!node.isDirectory && node.totalLines && (
                    <span className="text-xs text-muted-foreground ml-auto">
                        {node.totalLines} lines
                    </span>
                )}
            </div>

            {/* Children */}
            {node.isDirectory && isExpanded && node.children && (
                <div>
                    {node.children.map((child, index) => (
                        <TreeNode
                            key={index}
                            node={child}
                            onFileClick={onFileClick}
                            level={level + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
