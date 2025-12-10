export interface PullRequest {
    id: number;
    title: string;
    number: number;
    status: 'Merged' | 'Open' | 'Closed';
    author: string;
    authorAvatar?: string;
    sourceBranch: string;
    targetBranch: string;
    created: string;
    updated: string;
    merged?: string;
    filesChanged: {
        name: string;
        status: 'modified' | 'added' | 'deleted';
        additions: number;
        deletions: number;
    }[];
}

export const mockPullRequests: PullRequest[] = [
    {
        id: 10,
        title: 'Feat: Updated the README',
        number: 10,
        status: 'Merged',
        author: 'Vinhit07',
        authorAvatar: 'https://avatars.githubusercontent.com/u/1?v=4', // Placeholder
        sourceBranch: 'features/update_readme/vinith',
        targetBranch: 'staging-main',
        created: '11/5/2025, 8:10:02 AM',
        updated: '11/5/2025, 8:28:27 AM',
        merged: '11/5/2025, 8:28:23 AM',
        filesChanged: [
            {
                name: 'README.md',
                status: 'modified',
                additions: 2,
                deletions: 1
            }
        ]
    },
    // Add more mock data as needed to match the list in PullRequestList.tsx if we want full coverage
    { id: 11, title: 'Staging main to main', number: 11, status: 'Merged', author: 'Pavan-2503', sourceBranch: 'staging-main', targetBranch: 'main', created: '11/6/2025', updated: '11/6/2025', filesChanged: [] },
    { id: 9, title: 'updated readme file by naveen', number: 9, status: 'Merged', author: 'naveen', sourceBranch: 'fix/readme', targetBranch: 'main', created: '11/4/2025', updated: '11/4/2025', filesChanged: [] },
    { id: 8, title: 'Staging main', number: 8, status: 'Merged', author: 'Pavan-2503', sourceBranch: 'staging', targetBranch: 'main', created: '11/3/2025', updated: '11/3/2025', filesChanged: [] },
    { id: 7, title: 'Update readme/shree vathsan', number: 7, status: 'Merged', author: 'shree-vathsan', sourceBranch: 'update-readme', targetBranch: 'main', created: '11/2/2025', updated: '11/2/2025', filesChanged: [] },
    { id: 6, title: 'Feat: Added a new line in the readme', number: 6, status: 'Merged', author: 'Pavan-2503', sourceBranch: 'feat/newline', targetBranch: 'main', created: '11/1/2025', updated: '11/1/2025', filesChanged: [] },
    { id: 5, title: 'feat(module1): build simulator UI with form and chart.js', number: 5, status: 'Merged', author: 'Pavan-2503', sourceBranch: 'feat/simulator-ui', targetBranch: 'main', created: '10/31/2025', updated: '10/31/2025', filesChanged: [] },
    { id: 4, title: 'feat(module1): build and test cost simulator backend', number: 4, status: 'Merged', author: 'Pavan-2503', sourceBranch: 'feat/simulator-backend', targetBranch: 'main', created: '10/30/2025', updated: '10/30/2025', filesChanged: [] },
];

export interface Commit {
    id: string; // SHA
    message: string;
    author: string;
    date: string;
    additions: number;
    deletions: number;
    filesChangedCount: number;
    files: {
        name: string;
        status: 'modified' | 'added' | 'deleted';
        additions: number;
        deletions: number;
    }[];
}

export const mockCommits: Commit[] = [
    {
        id: '7d2780c8',
        message: '[FEAT] : updated the reports and graphs and alter certain ui components',
        author: 'Pavan',
        date: '9/17/2025, 2:13:43 PM',
        additions: 1184,
        deletions: 1067,
        filesChangedCount: 16,
        files: [
            { name: '.env.development', status: 'modified', additions: 2, deletions: 1 },
            { name: '.env.production', status: 'modified', additions: 2, deletions: 1 },
            { name: 'src/components/Header.jsx', status: 'modified', additions: 10, deletions: 6 },
            { name: 'src/components/ui/Badge.jsx', status: 'modified', additions: 5, deletions: 1 },
            { name: 'src/components/ui/Card.jsx', status: 'modified', additions: 15, deletions: 6 },
            { name: 'src/pages/Customer.jsx', status: 'modified', additions: 15, deletions: 10 },
            { name: 'src/pages/Expenditure.jsx', status: 'modified', additions: 141, deletions: 120 },
            { name: 'src/pages/Inventory.jsx', status: 'modified', additions: 12, deletions: 4 },
        ]
    },
    {
        id: 'a1b2c3d4',
        message: 'Fix: Resolved login issue',
        author: 'Alice',
        date: '9/16/2025, 10:00:00 AM',
        additions: 20,
        deletions: 5,
        filesChangedCount: 2,
        files: [
            { name: 'src/pages/Login.tsx', status: 'modified', additions: 15, deletions: 5 },
            { name: 'src/utils/auth.ts', status: 'modified', additions: 5, deletions: 0 },
        ]
    },
    {
        id: 'e5f6g7h8',
        message: 'Docs: Updated README',
        author: 'Bob',
        date: '9/15/2025, 4:30:00 PM',
        additions: 50,
        deletions: 10,
        filesChangedCount: 1,
        files: [
            { name: 'README.md', status: 'modified', additions: 50, deletions: 10 },
        ]
    }
];
