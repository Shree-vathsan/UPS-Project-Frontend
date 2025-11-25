import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddRepositoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [repoUrl, setRepoUrl] = useState("");

  const githubUsername = "Shreevathsan";

  const handleSubmit = () => {
    if (!repoUrl.trim()) return alert("Enter a valid repository URL");
    console.log("Analyzing:", repoUrl);
    alert("Repository analysis request submitted! (Dummy for now)");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* NAVBAR */}
      <nav className="w-full bg-white h-16 border-b flex items-center justify-between px-6">
        <div
          className="flex items-center gap-2 text-lg font-semibold cursor-pointer"
          onClick={() => navigate("/repositories")}
        >
          <div className="w-7 h-7 bg-indigo-500 rounded-md flex items-center justify-center text-white text-sm">
            F
          </div>
          Foresite
        </div>
        <button className="text-sm text-gray-700" onClick={() => navigate("/")}>Logout</button>
      </nav>
      
      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto pt-10 px-4">
  <h1 className="text-2xl font-semibold mb-6">Repository Management</h1>

  {/* Floating Tabs */}
  <div className="flex items-center gap-4 border-b pb-3 mb-8 text-sm font-medium">
    <button
      className="px-3 py-1 rounded-md text-gray-600 hover:bg-gray-100"
      onClick={() => navigate("/repos")}
    >
      Your Repository
    </button>

    <button
      className="px-3 py-1 rounded-md text-gray-600 hover:bg-gray-100"
      onClick={() => navigate("/analyzed")}
    >
      Analyzed Repository
    </button>

    <button className="px-3 py-1 rounded-md bg-indigo-50 text-indigo-600 border border-indigo-200">
      + Add Repository
    </button>
  </div>

  {/* Add Repo Form */}
  <div className="max-w-xl mx-auto">
    <div className="text-4xl text-indigo-500 font-bold flex justify-center mb-4">
      +
    </div>

    <h2 className="text-lg font-semibold text-center mb-1">
      Add Repository to Analyze
    </h2>

    <p className="text-center text-gray-600 text-sm mb-6">
      Add any public GitHub repository to analyze.
    </p>

    <label className="text-sm text-gray-700 font-medium">
      GitHub Repository URL
    </label>

    <input
      type="text"
      placeholder="https://github.com/user/repo"
      value={repoUrl}
      onChange={(e) => setRepoUrl(e.target.value)}
      className="w-full border px-3 py-2 rounded-md mt-1 text-sm focus:border-indigo-500 outline-none"
    />

    <button
      className="w-full bg-green-600 text-white py-2 rounded-md mt-4 hover:bg-green-700 text-sm"
      onClick={handleSubmit}
    >
      Analyze Repository
    </button>

    {/* Info Box */}
    <div className="bg-white border rounded-md mt-6 p-4 text-sm">
      <h3 className="text-gray-700 font-medium mb-2">🔹 Supported URL Formats:</h3>
      <ul className="list-disc ml-5 text-gray-600">
        <li>https://github.com/owner/repo</li>
        <li>https://github.com/owner/repo.git</li>
        <li>git@github.com:owner/repo</li>
        <li>owner/repo</li>
      </ul>

      <p className="text-xs text-gray-500 mt-3">
        Only public repositories can be analyzed.
      </p>
    </div>
  </div>
</main>

    </div>
  );
};

export default AddRepositoryPage;
