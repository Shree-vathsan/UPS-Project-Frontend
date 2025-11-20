// import RepoList from "../components/RepoList";
// import React, { useEffect, useState } from "react";
// import { fakeRepos } from "../data/fakeRepos";

// const GithubRepositoriesPage: React.FC = () => {
//   const [repos, setRepos] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const [currentPage, setCurrentPage] = useState(1);
//   const reposPerPage = 5;

//   const indexOfLastRepo = currentPage * reposPerPage;
//   const indexOfFirstRepo = indexOfLastRepo - reposPerPage;
//   const currentRepos = repos.slice(indexOfFirstRepo, indexOfLastRepo);

//   useEffect(() => {
//     setLoading(true);
//     setRepos(fakeRepos);
//     setLoading(false);
//   }, []);

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <nav className="w-full bg-white h-16 border-b flex items-center justify-between px-6">
//         <div className="flex items-center gap-2 text-lg font-semibold">
//           <div className="w-7 h-7 bg-indigo-500 rounded-md flex items-center justify-center text-white text-sm">
//             F
//           </div>
//           Foresite
//         </div>
//         <button className="text-sm text-gray-700">Logout</button>
//       </nav>

//       <main className="max-w-5xl mx-auto pt-10 px-4">
//         <h1 className="text-xl font-semibold mb-6">Your Repositories</h1>

//         {loading && <div className="text-gray-600">Loading...</div>}
//         {error && <div className="text-red-600">{error}</div>}

//         {!loading && !error && (
//           <RepoList
//             repos={currentRepos}
//             currentPage={currentPage}
//             totalPages={Math.ceil(repos.length / reposPerPage)}
//             onPageChange={setCurrentPage}
//           />
//         )}
//       </main>
//     </div>
//   );
// };

// export default GithubRepositoriesPage;


import RepoList from "../components/RepoList";
import React, { useEffect, useState } from "react";
import { fakeRepos } from "../data/fakeRepos";
// import { fileTreeData } from "../data/fileTree";


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
    <div className="min-h-screen bg-gray-50">
      <nav className="w-full bg-white h-16 border-b flex items-center justify-between px-6">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <div className="w-7 h-7 bg-indigo-500 rounded-md flex items-center justify-center text-white text-sm">
            F
          </div>
          Foresite
        </div>
        <button className="text-sm text-gray-700">Logout</button>
      </nav>

      <main className="max-w-7xl mx-auto pt-10 px-4">
        <h1 className="text-2xl font-semibold mb-6">Your Repositories</h1>

        {loading && <div className="text-gray-600">Loading...</div>}
        {error && <div className="text-red-600">{error}</div>}

        {!loading && !error && (
          <RepoList
            repos={currentRepos}
            currentPage={currentPage}
            totalPages={Math.ceil(repos.length / reposPerPage)}
            onPageChange={setCurrentPage}
          />
        )}
      </main>
    </div>
  );
};

export default GithubRepositoriesPage;
