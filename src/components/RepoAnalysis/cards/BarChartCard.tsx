import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import SectionHeader from "./SectionHeader";

const BarChartCard = ({ title, subtitle, data, dataKey, labelKey, color, layout = "horizontal" }) => {
    return (
        <div className="bg-[#161b22] border border-[#30363d] rounded p-5">
            <SectionHeader icon="🔥" title={title} />
            <div className="text-xs text-gray-500 mb-4">{subtitle}</div>
            <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data} layout={layout}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#30363d" horizontal={false} />
                    <XAxis
                        type="number"
                        stroke="#8b949e"
                        tick={{ fill: '#8b949e', fontSize: 11 }}
                        tickLine={false}
                        axisLine={{ stroke: '#30363d' }}
                    />
                    <YAxis
                        type="category"
                        dataKey={labelKey}
                        stroke="#8b949e"
                        tick={{ fill: '#8b949e', fontSize: 11 }}
                        width={100}
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
                    <Bar dataKey={dataKey} fill={color} radius={[0, 4, 4, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default BarChartCard;