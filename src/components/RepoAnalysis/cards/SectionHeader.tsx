import React from "react";

const SectionHeader = ({ icon, title } : any) => {
    return (
        <div className="flex items-center gap-2 mb-1">
            <div className="text-sm">{icon}</div>
            <h2 className="text-sm font-medium text-gray-200">{title}</h2>
        </div>
    );
};

export default SectionHeader;