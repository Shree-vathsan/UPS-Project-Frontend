import React, { useState } from "react";
import { fakeRepos } from "../data/fakeRepos";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { Btn } from "../components/Button";
import RepoCard from "../components/RepoCard";
import { fileTreeData } from "../data/fileTree";

const AnalyzedRepositoriesPage: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<"all" | "your" | "others">("all");

  const githubUsername = "Shreevathsan"; // replace later

  const filteredRepos = fakeRepos.filter((repo) => {
    if (filter === "your") return repo.name.toLowerCase().includes(githubUsername.toLowerCase());
    if (filter === "others") return !repo.name.toLowerCase().includes(githubUsername.toLowerCase());
    return repo;
  });

  return (
    <Layout title="Analyzed Repositories">
      {/* Filter Buttons */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2">
          {["all", "your", "others"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab as any)}
              className={`px-4 py-1.5 text-sm font-medium rounded-lg capitalize transition-colors ${filter === tab
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-white dark:bg-[#172748] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-[#1e3a6f]"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <Btn variant="secondary" className="!py-1.5 !px-3 !text-xs" onClick={() => { }}>
          Refresh
        </Btn>
      </div>

      {/* Repo List */}
      <div className="flex flex-col gap-4">
        {filteredRepos.map((repo) => (
          <RepoCard
            key={repo.id}
            repo={repo}
            onClick={() => {
              navigate(`/repo/${repo.name}`, {
                state: {
                  repo: repo,
                  fileTree: fileTreeData,
                  codeSnippet: (repo as any).code_snippet,
                },
              });
            }}
          />
        ))}
      </div>
    </Layout>
  );
};

export default AnalyzedRepositoriesPage;
