import React from "react";

const MetricCard = ({ icon, label, value, color }) => {
    return (
        <div className="bg-[#161b22] border border-[#30363d] rounded p-4">
            <div className="flex items-start gap-2">
                <div className="text-xl">{icon}</div>
                <div className="flex-1">
                    <div className="text-xs text-gray-400 mb-1">{label}</div>
                    <div className={`text-2xl font-semibold ${color}`}>{value}</div>
                </div>
            </div>
        </div>
    );
};

export default MetricCard;