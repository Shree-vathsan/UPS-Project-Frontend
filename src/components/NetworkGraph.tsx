import { useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface Node {
    id: string;
    label: string;
    x: number;
    y: number;
    type: 'center' | 'dependency' | 'dependent' | 'neighbor';
}

interface Edge {
    from: string;
    to: string;
    type: 'dependency' | 'dependent' | 'neighbor';
}

interface NetworkGraphProps {
    centerFile: string;
    dependencies?: any[];
    dependents?: any[];
    neighbors?: any[];
}

export default function NetworkGraph({ centerFile, dependencies = [], dependents = [], neighbors = [] }: NetworkGraphProps) {
    const svgRef = useRef<SVGSVGElement>(null);
    const [legendExpanded, setLegendExpanded] = useState(false);

    const width = 1200;
    const height = 800;
    const centerX = width / 2;
    const centerY = height / 2;

    // Create nodes and edges
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    // Center node
    nodes.push({
        id: 'center',
        label: centerFile.split('/').pop() || centerFile,
        x: centerX,
        y: centerY,
        type: 'center'
    });

    // Dependencies (LEFT side)
    const depCount = Math.min(dependencies.length, 8);
    const depSpacing = Math.min(120, 600 / (depCount || 1));
    dependencies.slice(0, 8).forEach((dep, i) => {
        const id = `dep-${i}`;
        const startY = centerY - ((depCount - 1) * depSpacing) / 2;
        nodes.push({
            id,
            label: dep.targetPath?.split('/').pop() || `Dep ${i + 1}`,
            x: 150,
            y: startY + i * depSpacing,
            type: 'dependency'
        });
        edges.push({ from: id, to: 'center', type: 'dependency' });
    });

    // Dependents (RIGHT side)
    const dptCount = Math.min(dependents.length, 8);
    const dptSpacing = Math.min(120, 600 / (dptCount || 1));
    dependents.slice(0, 8).forEach((dep, i) => {
        const id = `dpt-${i}`;
        const startY = centerY - ((dptCount - 1) * dptSpacing) / 2;
        nodes.push({
            id,
            label: dep.sourcePath?.split('/').pop() || `Dependent ${i + 1}`,
            x: width - 150,
            y: startY + i * dptSpacing,
            type: 'dependent'
        });
        edges.push({ from: 'center', to: id, type: 'dependent' });
    });

    // Neighbors (TOP)
    const nbrCount = Math.min(neighbors.length, 6);
    const nbrSpacing = Math.min(180, 900 / (nbrCount || 1));
    neighbors.slice(0, 6).forEach((neighbor, i) => {
        const id = `nbr-${i}`;
        const startX = centerX - ((nbrCount - 1) * nbrSpacing) / 2;
        nodes.push({
            id,
            label: neighbor.filePath?.split('/').pop() || `Neighbor ${i + 1}`,
            x: startX + i * nbrSpacing,
            y: 120,
            type: 'neighbor'
        });
        edges.push({ from: 'center', to: id, type: 'neighbor' });
    });

    const getNodeGradient = (type: string) => {
        switch (type) {
            case 'center': return 'url(#centerGrad)';
            case 'dependency': return 'url(#depGrad)';
            case 'dependent': return 'url(#dptGrad)';
            case 'neighbor': return 'url(#nbrGrad)';
            default: return '#8b949e';
        }
    };

    const getEdgeColor = (type: string) => {
        switch (type) {
            case 'dependency': return '#3fb950';
            case 'dependent': return '#f0883e';
            case 'neighbor': return '#bc8cff';
            default: return '#8b949e';
        }
    };

    const wrapText = (text: string, maxLength: number): string[] => {
        if (text.length <= maxLength) return [text];
        const parts = text.split(/[._-]/);
        if (parts.length > 1) {
            return [parts[0], parts.slice(1).join('')].slice(0, 2);
        }
        return [text.substring(0, maxLength - 2) + '..'];
    };

    return (
        <div className="w-full h-[800px] bg-card/50 rounded-xl border overflow-hidden relative shadow-lg">
            <svg
                ref={svgRef}
                width="100%"
                height="100%"
                viewBox={`0 0 ${width} ${height}`}
                style={{ display: 'block' }}
            >
                <defs>
                    <radialGradient id="centerGrad">
                        <stop offset="0%" stopColor="#58a6ff" stopOpacity="1" />
                        <stop offset="100%" stopColor="#1f6feb" stopOpacity="1" />
                    </radialGradient>
                    <radialGradient id="depGrad">
                        <stop offset="0%" stopColor="#56d364" stopOpacity="1" />
                        <stop offset="100%" stopColor="#2ea043" stopOpacity="1" />
                    </radialGradient>
                    <radialGradient id="dptGrad">
                        <stop offset="0%" stopColor="#f0883e" stopOpacity="1" />
                        <stop offset="100%" stopColor="#d15704" stopOpacity="1" />
                    </radialGradient>
                    <radialGradient id="nbrGrad">
                        <stop offset="0%" stopColor="#e5b9ff" stopOpacity="1" />
                        <stop offset="100%" stopColor="#bc8cff" stopOpacity="1" />
                    </radialGradient>
                </defs>

                {/* Draw all edges */}
                {edges.map((edge, i) => {
                    const fromNode = nodes.find(n => n.id === edge.from);
                    const toNode = nodes.find(n => n.id === edge.to);
                    if (!fromNode || !toNode) return null;

                    return (
                        <line
                            key={`edge-${i}`}
                            x1={fromNode.x}
                            y1={fromNode.y}
                            x2={toNode.x}
                            y2={toNode.y}
                            stroke={getEdgeColor(edge.type)}
                            strokeWidth={4}
                            strokeLinecap="round"
                        />
                    );
                })}

                {/* Draw all nodes */}
                {nodes.map((node) => {
                    const nodeSize = node.type === 'center' ? 65 : 45;
                    const textLines = wrapText(node.label, node.type === 'center' ? 11 : 9);

                    return (
                        <g key={node.id}>
                            <circle
                                cx={node.x}
                                cy={node.y}
                                r={nodeSize}
                                fill={getNodeGradient(node.type)}
                                stroke="rgba(255, 255, 255, 0.3)"
                                strokeWidth={2}
                            />

                            {textLines.map((line, idx) => (
                                <text
                                    key={idx}
                                    x={node.x}
                                    y={node.y + (textLines.length === 1 ? 5 : -6 + idx * 13)}
                                    textAnchor="middle"
                                    fill="#0d1117"
                                    fontSize={node.type === 'center' ? 15 : 12}
                                    fontWeight="bold"
                                    style={{
                                        pointerEvents: 'none',
                                        filter: 'drop-shadow(0 0 2px rgba(255,255,255,0.5))',
                                        fontFamily: 'ui-monospace, monospace'
                                    }}
                                >
                                    {line}
                                </text>
                            ))}
                        </g>
                    );
                })}
            </svg>

            {/* Collapsible Legend */}
            <div className="absolute top-5 right-5">
                {/* Toggle Button */}
                <button
                    onClick={() => setLegendExpanded(!legendExpanded)}
                    className="bg-card/90 backdrop-blur-lg border rounded-xl px-4 py-2 text-sm font-bold text-primary shadow-lg hover:bg-card transition-all duration-300 flex items-center gap-2"
                >
                    <span>Legend</span>
                    <ChevronDown
                        size={16}
                        className="transition-transform duration-300"
                        style={{
                            transform: legendExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
                        }}
                    />
                </button>

                {/* Expandable Legend Content */}
                <div
                    className="overflow-hidden transition-all duration-300 ease-in-out"
                    style={{
                        maxHeight: legendExpanded ? '200px' : '0px',
                        opacity: legendExpanded ? 1 : 0,
                        marginTop: legendExpanded ? '8px' : '0px'
                    }}
                >
                    <div className="bg-card/90 backdrop-blur-lg border rounded-xl p-4 text-xs shadow-lg">
                        <div className="grid gap-2.5">
                            <div className="flex items-center gap-2.5">
                                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#58a6ff] to-[#1f6feb] shadow-lg"></div>
                                <span className="text-foreground font-medium">Current File</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#56d364] to-[#2ea043] shadow-lg"></div>
                                <span className="text-foreground font-medium">Dependencies (Left)</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#f0883e] to-[#d15704] shadow-lg"></div>
                                <span className="text-foreground font-medium">Dependents (Right)</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#e5b9ff] to-[#bc8cff] shadow-lg"></div>
                                <span className="text-foreground font-medium">Similar Files (Top)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

