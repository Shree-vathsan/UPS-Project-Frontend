import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddRepositoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [repoUrl, setRepoUrl] = useState("");

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
      <main className="max-w-xl mx-auto pt-14 px-4">
        {/* Big Plus Icon */}
        <div className="text-4xl text-indigo-500 font-bold flex justify-center mb-4">
          +
        </div>

        <h1 className="text-xl font-semibold text-center">
          Add Repository to Analyze
        </h1>

        <p className="text-center text-gray-600 text-sm mt-1 mb-6">
          Add any public GitHub repository to analyze, even if the owner hasn’t logged into this platform.
        </p>

        {/* INPUT BOX */}
        <label className="text-sm text-gray-700 font-medium">GitHub Repository URL</label>
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

        {/* INFO BOX */}
        <div className="bg-white border rounded-md mt-6 p-4 text-sm">
          <h3 className="text-gray-700 font-medium mb-2">🔹 Supported URL Formats:</h3>
          <ul className="list-disc ml-5 text-gray-600">
            <li>https://github.com/owner/repo</li>
            <li>https://github.com/owner/repo.git</li>
            <li>git@github.com:owner/repo</li>
            <li>owner/repo</li>
          </ul>

          <p className="text-xs text-gray-500 mt-3">
            <strong>Note:</strong> Only public repositories can be analyzed. Private repositories require the owner to log in.
          </p>
        </div>
      </main>
    </div>
  );
};

export default AddRepositoryPage;
