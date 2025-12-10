import React from "react";
import { Btn } from "./Button";
import { useNavigate, useParams } from "react-router-dom";
import { mockPullRequests } from "../data/mockData";
import { StatusBadge } from "./StatusBadge";

const PullRequestList: React.FC = () => {
  const navigate = useNavigate();
  const { repoName } = useParams();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Pull Requests ({mockPullRequests.length})
        </h2>

        <div className="flex gap-2">
          <div className="bg-blue-600 text-white px-3 py-1 rounded-md text-xs font-medium cursor-pointer">
            All
          </div>
          <div className="text-gray-600 dark:text-gray-400 px-3 py-1 rounded-md text-xs font-medium hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
            Open
          </div>
          <div className="text-gray-600 dark:text-gray-400 px-3 py-1 rounded-md text-xs font-medium hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
            Closed
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {mockPullRequests.map((pr) => (
          <div
            key={pr.id}
            className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col gap-1">
              <h3
                className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                onClick={() =>
                  navigate(`/repo/${repoName}/pr/${pr.id}`)
                }
              >
                {pr.title}
              </h3>

              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <span>#{pr.id}</span>
                <StatusBadge status={pr.status} className="!rounded !px-1" />
              </div>
            </div>

            <Btn
              variant="secondary"
              className="!py-1.5 !px-3 !text-xs"
              onClick={() =>
                navigate(`/repo/${repoName}/pr/${pr.id}`)
              }
            >
              View PR →
            </Btn>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PullRequestList;
