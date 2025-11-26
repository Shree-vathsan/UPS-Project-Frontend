import React, { useEffect, useState } from "react";
import RepoList from "../components/RepoList";
import { fakeRepos } from "../data/fakeRepos";
import Layout from "../components/Layout";

// Proper type for a repository
export interface Repo {
  id: number;
  name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  private: boolean;
}

const GithubRepositoriesPage: React.FC = () => {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const [currentPage, setCurrentPage] = useState<number>(1);
  const reposPerPage = 5;

  const indexOfLastRepo = currentPage * reposPerPage;
  const indexOfFirstRepo = indexOfLastRepo - reposPerPage;
  const currentRepos = repos.slice(indexOfFirstRepo, indexOfLastRepo);

  useEffect(() => {
    try {
      setLoading(true);
      setRepos(fakeRepos);
    } catch {
      setError("Failed to load repositories");
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <Layout title="Repository Management">
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {!loading && !error && (
        <RepoList
          repos={currentRepos}
          currentPage={currentPage}
          totalPages={Math.ceil(repos.length / reposPerPage)}
          onPageChange={setCurrentPage}
        />
      )}
    </Layout>
  );
};

export default GithubRepositoriesPage;
