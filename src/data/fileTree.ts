
import type { FileNode } from "../pages/RepositoryDetailsPage";

export const fileTreeData: FileNode[] = [
  {
    name: "src",
    type: "folder",
    path: "src",
    children: [
      {
        name: "components",
        type: "folder",
        path: "src/components",
        children: [
          { name: "Button.tsx", type: "file", path: "src/components/Button.tsx" },
          { name: "Modal.tsx", type: "file", path: "src/components/Modal.tsx" },
        ],
      },
      {
        name: "hooks",
        type: "folder",
        path: "src/hooks",
        children: [{ name: "useAuth.ts", type: "file", path: "src/hooks/useAuth.ts" }],
      },
      { name: "App.tsx", type: "file", path: "src/App.tsx" },
    ],
  },
  { name: "package.json", type: "file", path: "package.json" },
  { name: "README.md", type: "file", path: "README.md" },
];
