import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import BarChartCard from './cards/BarChartCard';
import LineChartCard from './cards/LineChartCard';
import MetricCard from './cards/MetricCard';
import PieChartCard from './cards/PieChartCard';
import SectionHeader from './cards/SectionHeader';
import mockData from "./data.json";



const RepoAnalysis = () => {
    return (
        <div className="min-h-screen bg-[#0d1117] text-white p-8">
            <div className="max-w-[1400px] mx-auto space-y-8">

                {/* Page 1: Repository Analytics */}
                <div>
                    <h1 className="text-xl font-semibold mb-6 text-gray-200">Repository Analytics</h1>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-4 gap-4 mb-6">
                        <MetricCard icon="📁" label="Total Files" value={mockData.summary.totalFiles} color="text-blue-400" />
                        <MetricCard icon="💾" label="Total Commits" value={mockData.summary.totalCommits} color="text-purple-400" />
                        <MetricCard icon="👥" label="Contributors" value={mockData.summary.contributors} color="text-pink-400" />
                        <MetricCard icon="⚡" label="Last 7 Days" value={mockData.summary.last7Days} color="text-orange-400" />
                    </div>

                    {/* Code Health Score */}
                    <div className="bg-[#161b22] border border-[#30363d] rounded p-6 mb-6">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="text-blue-400">💎</div>
                            <h2 className="text-sm font-medium text-gray-200">Code Health Score</h2>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="relative flex items-center justify-center">
                                <svg width="120" height="120" className="transform -rotate-90">
                                    <circle cx="60" cy="60" r="50" stroke="#30363d" strokeWidth="8" fill="none" />
                                    <circle
                                        cx="60"
                                        cy="60"
                                        r="50"
                                        stroke="#f59e0b"
                                        strokeWidth="8"
                                        fill="none"
                                        strokeDasharray={`${mockData.codeHealth.score * 3.14} 314`}
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-4xl font-semibold">{mockData.codeHealth.score}%</div>
                                </div>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-gray-300 mb-3">
                                    {mockData.codeHealth.description} <span className="text-green-400">🟢 Good health</span>
                                </p>
                                <div className="flex gap-2">
                                    <span className="px-2 py-1 bg-cyan-900/30 text-cyan-400 text-xs rounded border border-cyan-800">All repository</span>
                                    <span className="px-2 py-1 bg-purple-900/30 text-purple-400 text-xs rounded border border-purple-800">Active repository</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Charts Row */}
                    <div className="grid grid-cols-2 gap-6 mb-6">
                        <LineChartCard title="Commit Activity Timeline" subtitle="Last 30 days of commit activity" data={mockData.commitTimeline} />
                        <PieChartCard title="File Types" subtitle="Codebase composition" data={mockData.fileTypes} />
                    </div>

                    {/* Change Hotspots */}
                    <div className="mb-4">
                        <BarChartCard
                            title="Change Hotspots"
                            subtitle="Most frequently modified files"
                            data={mockData.hotspots}
                            dataKey="changes"
                            labelKey="file"
                            color="#ef4444"
                        />
                    </div>

                    {/* Warning Message */}
                    <div className="bg-red-900/10 border border-red-900/30 rounded p-3 flex items-start gap-2 mb-6">
                        <div className="text-red-400 text-sm">⚠️</div>
                        <span className="text-red-400 text-xs">
                            2 files with high change frequency may benefit from refactoring or additional testing
                        </span>
                    </div>

                    {/* Detailed Breakdown */}
                    <div className="bg-[#161b22] border border-[#30363d] rounded p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="text-sm">📋</div>
                            <h2 className="text-sm font-medium text-gray-200">Detailed Breakdown</h2>
                        </div>
                        <div className="space-y-2">
                            {mockData.detailedBreakdown.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                    <div className="flex items-center gap-2 w-20">
                                        <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: item.color }}></div>
                                        <span className="text-xs text-gray-300 font-mono">{item.language}</span>
                                    </div>
                                    <div className="flex-1 bg-[#0d1117] rounded-sm h-4 relative overflow-hidden">
                                        <div
                                            className="h-full transition-all duration-300"
                                            style={{ width: item.bar, backgroundColor: item.color }}
                                        ></div>
                                    </div>
                                    <div className="w-16 text-xs text-gray-400">{item.files}</div>
                                    <div className="w-12 text-xs text-gray-200 text-right font-medium">{item.percentage}%</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Page 2: Team Insights */}
                <div className="mt-16">
                    <h1 className="text-xl font-semibold mb-6 text-gray-200">Team Insights</h1>

                    {/* Team Stats Cards */}
                    <div className="grid grid-cols-4 gap-4 mb-6">
                        <MetricCard icon="👥" label="Total Contributors" value={mockData.team.totalContributors} color="text-purple-400" />
                        <MetricCard icon="✅" label="Active (7d)" value={mockData.team.active7d} color="text-green-400" />
                        <MetricCard icon="📊" label="Avg Commits" value={mockData.team.avgCommits} color="text-blue-400" />
                        <div className="bg-[#161b22] border border-[#30363d] rounded p-4">
                            <div className="flex items-start gap-2">
                                <div className="text-xl">📅</div>
                                <div className="flex-1">
                                    <div className="text-xs text-gray-400 mb-1">Most Active Day</div>
                                    <div className="text-base font-semibold text-purple-400">{mockData.team.mostActiveDay}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Team Collaboration Score */}
                    <div className="bg-[#161b22] border border-[#30363d] rounded p-6 mb-6">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="text-yellow-400">🛡️</div>
                            <h2 className="text-sm font-medium text-gray-200">Team Collaboration Score</h2>
                        </div>
                        <div className="text-xs text-gray-400 mb-6">
                            Based on number of contributors, commit distribution, and code ownership patterns.
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="relative flex items-center justify-center">
                                <svg width="120" height="120" className="transform -rotate-90">
                                    <circle cx="60" cy="60" r="50" stroke="#30363d" strokeWidth="8" fill="none" />
                                    <circle
                                        cx="60"
                                        cy="60"
                                        r="50"
                                        stroke="#3b82f6"
                                        strokeWidth="8"
                                        fill="none"
                                        strokeDasharray={`${mockData.collaborationScore.score * 3.14} 314`}
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-4xl font-semibold">{mockData.collaborationScore.score}</div>
                                </div>
                            </div>
                            <div className="text-sm text-blue-400 font-mono">{mockData.collaborationScore.activeContributors}</div>
                        </div>
                    </div>

                    {/* Top Contributors */}
                    <div className="bg-[#161b22] border border-[#30363d] rounded p-5">
                        <SectionHeader icon="🏆" title="Top Contributors" />
                        <div className="text-xs text-gray-500 mb-4">Ranked by commit count and code impact</div>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={mockData.topContributors}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#30363d" vertical={false} />
                                <XAxis
                                    dataKey="name"
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
                                <Bar dataKey="commits" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Commits" />
                                <Bar dataKey="filesChanged" fill="#22c55e" radius={[4, 4, 0, 0]} name="Files Changed" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default RepoAnalysis;

