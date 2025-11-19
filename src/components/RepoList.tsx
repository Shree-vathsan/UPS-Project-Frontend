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
};


const RepoList: React.FC<Props> = ({ repos }) => {
return (
<>
<div className="flex flex-col gap-4">
{repos.map((repo) => (
<RepoCard key={repo.id} repo={repo} />
))}
</div>
<Pagination />
</>
);
};


export default RepoList;