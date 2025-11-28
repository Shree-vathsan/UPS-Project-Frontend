import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import SectionHeader from "./SectionHeader";

const PieChartCard = ({ title, subtitle, data }) => {
    return (
        <div className="bg-[#161b22] border border-[#30363d] rounded p-5">
            <SectionHeader icon="📄" title={title} />
            <div className="text-xs text-gray-500 mb-4">{subtitle}</div>
            <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ name }) => name}
                        labelLine={{ stroke: '#8b949e' }}
                    >
                        {data.map((entry, index) => (
                            <Cell key={index} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#161b22',
                            border: '1px solid #30363d',
                            borderRadius: '6px',
                            fontSize: '12px'
                        }}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PieChartCard;