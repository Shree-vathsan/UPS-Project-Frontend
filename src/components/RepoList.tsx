import React from "react";
import RepoCard from "./RepoCard";
import Pagination from "./Pagination";
import { useNavigate } from "react-router-dom";
import { fileTreeData } from "../data/fileTree";

type Repo = {
  id: number;
  name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  private: boolean;
  code_snippet?: string;
};

type Props = {
  repos: Repo[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const RepoList: React.FC<Props> = ({
  repos,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex flex-col gap-4">
        {repos.map((repo) => (
          <RepoCard
            key={repo.id}
            repo={repo}
            onClick={() => {
              navigate(`/repo/${repo.name}`, {
                state: {
                  repo: repo,
                  fileTree: fileTreeData, // send your file structure
                  codeSnippet: repo.code_snippet, // send the code snippet
                },
              });
            }}
          />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </>
  );
};

export default RepoList;
