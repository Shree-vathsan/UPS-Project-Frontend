import React from "react";


type Repo = {
name: string;
description: string;
stargazers_count: number;
forks_count: number;
updated_at: string;
private: boolean;
};


type Props = { 
    repo: Repo;
    onClick: () => void;
 };


const RepoCard: React.FC<Props> = ({ repo, onClick }) => {
return (
<div
    onClick={onClick}
    className="w-full bg-white border rounded-xl p-5 flex flex-col gap-2 cursor-pointer hover:shadow-md transition">
<div className="w-full bg-white border rounded-xl p-5 flex flex-col gap-2">
<div className="flex items-center justify-between">
<div className="flex items-center gap-2 text-blue-600 font-medium text-sm">
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
<path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.5h16.5m-16.5 0v13.5a2.25 2.25 0 002.25 2.25h12a2.25 2.25 0 002.25-2.25V4.5m-16.5 0l7.5 7.5m0 0l7.5-7.5m-7.5 7.5V21" />
</svg>
{repo.name}
</div>
<span className="text-xs bg-gray-100 border rounded-full px-2 py-0.5">
{repo.private ? "Private" : "Public"}
</span>
</div>
</div>


<p className="text-gray-600 text-sm">{repo.description}</p>


<div className="flex items-center gap-5 text-gray-600 text-sm pt-1">
<div className="flex items-center gap-1">★ {repo.stargazers_count}</div>
<div className="flex items-center gap-1">🍴 {repo.forks_count}</div>
<div className="text-xs text-gray-500">Updated {new Date(repo.updated_at).toLocaleDateString()}</div>
</div>
</div>
);
};


export default RepoCard;