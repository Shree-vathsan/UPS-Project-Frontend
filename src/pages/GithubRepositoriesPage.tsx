import RepoList from "../components/RepoList";
import React, { useEffect, useState } from "react";
async function fetchUserRepos(token: string) {
const res = await fetch("https://api.github.com/user/repos", {
headers: { Authorization: `Bearer ${token}` },
});
if (!res.ok) throw new Error("Failed to fetch repositories");
return res.json();
}


const GithubRepositoriesPage: React.FC = () => {
const [repos, setRepos] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");


useEffect(() => {
const loadRepos = async () => {
try {
const token = "PLACEHOLDER_GITHUB_TOKEN"; // Replace after OAuth
const data = await fetchUserRepos(token);
setRepos(data);
} catch {
setError("Could not load repositories.");
} finally {
setLoading(false);
}
};
loadRepos();
}, []);


return (
<div className="min-h-screen bg-gray-50">
<nav className="w-full bg-white h-16 border-b flex items-center justify-between px-6">
<div className="flex items-center gap-2 text-lg font-semibold">
<div className="w-7 h-7 bg-indigo-500 rounded-md flex items-center justify-center text-white text-sm">F</div>
Foresite
</div>
<button className="text-sm text-gray-700">Logout</button>
</nav>


<main className="max-w-5xl mx-auto pt-10 px-4">
<h1 className="text-xl font-semibold mb-6">Your Repositories</h1>


{loading && <div className="text-gray-600">Loading...</div>}
{error && <div className="text-red-600">{error}</div>}


{!loading && !error && <RepoList repos={repos} />}
</main>
</div>
);
};


export default GithubRepositoriesPage;