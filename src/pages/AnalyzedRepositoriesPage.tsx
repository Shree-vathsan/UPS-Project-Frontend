import React, { useState } from "react";
import { fakeRepos } from "../data/fakeRepos";
import { useNavigate } from "react-router-dom";

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
    <div className="min-h-screen bg-gray-50">
      
      {/* Top Navbar */}
      <nav className="w-full bg-white h-16 border-b flex items-center justify-between px-6">
        <div className="flex items-center gap-2 text-lg font-semibold cursor-pointer"
          onClick={() => navigate("/")}>
          <div className="w-7 h-7 bg-indigo-500 rounded-md flex items-center justify-center text-white text-sm">
            F
          </div>
          Foresite
        </div>
        <button className="text-sm text-gray-700" onClick={() => navigate("/")}>Logout</button>
      </nav>

      {/* Page content */}
      <main className="max-w-7xl mx-auto pt-10 px-4">
        <h1 className="text-2xl font-semibold mb-6">Repository Management</h1>

        {/* Tabs */}
        <div className="flex items-center gap-4 border-b pb-3 mb-6 text-sm font-medium">
          <button className="px-3 py-1 rounded-md text-gray-600 hover:bg-gray-100"
            onClick={() => navigate("/repos")}>
            Your Repository
          </button>

          <button className="px-3 py-1 rounded-md bg-indigo-50 text-indigo-600 border border-indigo-200">
            Analyzed Repository
          </button>

          <button className="px-3 py-1 rounded-md text-gray-600 hover:bg-gray-100"
            onClick={() => navigate("/add-repository")}>
            + Add Repository
          </button>
        </div>

        {/* Filter Buttons */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            {["all", "your", "others"].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab as any)}
                className={`px-3 py-1 text-sm rounded-md capitalize ${
                  filter === tab
                    ? "bg-indigo-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <button className="px-3 py-1 text-xs border rounded-md hover:bg-gray-100">
            Refresh
          </button>
        </div>

        {/* Repo List */}
        <div className="space-y-3">
          {filteredRepos.map((repo) => (
            <div key={repo.id}
              className="bg-white border rounded-lg px-4 py-3 flex justify-between items-center">
              
              <div>
                <span className="text-blue-600 text-sm font-medium">
                  {repo.name}
                </span>
                
                <div className="flex gap-2 mt-1">
                  <span className="text-xs px-2 py-0.5 bg-green-100 text-green-600 rounded-full">
                    New Repository
                  </span>
                  <span className="text-xs px-2 py-0.5 bg-green-100 text-green-600 rounded-full">
                    Ready
                  </span>
                </div>
              </div>

              <button className="px-3 py-1 text-xs border rounded-md hover:bg-gray-100"
                onClick={() => navigate(`/repo/${repo.id}`)}>
                View Details →
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AnalyzedRepositoriesPage;
