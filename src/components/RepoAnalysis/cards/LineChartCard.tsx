import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import SectionHeader from "./SectionHeader";

const LineChartCard = ({ title, subtitle, data }) => {
    return (
        <div className="bg-[#161b22] border border-[#30363d] rounded p-5">
            <SectionHeader icon="📊" title={title} />
            <div className="text-xs text-gray-500 mb-4">{subtitle}</div>
            <ResponsiveContainer width="100%" height={200}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#30363d" vertical={false} />
                    <XAxis
                        dataKey="date"
                        stroke="#8b949e"
                        tick={{ fill: '#8b949e', fontSize: 11 }}
                        tickLine={false}
                        axisLine={{ stroke: '#30363d' }}
                    />
                    <YAxis
                        stroke="#8b949e"
                        tick={{ fill: '#8b949e', fontSize: 11 }}
                        tickLine={false}
                        axisLine={{ stroke: '#30363d' }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#161b22',
                            border: '1px solid #30363d',
                            borderRadius: '6px',
                            fontSize: '12px'
                        }}
                    />
                    <Line
                        type="monotone"
                        dataKey="commits"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={{ fill: '#3b82f6', r: 3 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default LineChartCard;