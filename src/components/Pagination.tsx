import React from "react";


const Pagination: React.FC = () => (
<div className="w-full flex items-center justify-center py-10 gap-4 text-sm">
<button className="px-4 py-2 border rounded-lg bg-white">← Previous</button>
<span className="text-gray-600">Page 1 of 1</span>
<button className="px-4 py-2 border rounded-lg bg-white">Next →</button>
</div>
);


export default Pagination;