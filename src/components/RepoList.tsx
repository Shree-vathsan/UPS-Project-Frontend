import React from "react";
import RepoCard from "./RepoCard";
import Pagination from "./Pagination";


type Repo = {
id: number;
name: string;
description: string;
stargazers_count: number;
forks_count: number;
updated_at: string;
private: boolean;
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
  return (
    <>
      <div className="flex flex-col gap-4">
        {repos.map((repo) => (
          <RepoCard key={repo.id} repo={repo} />
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