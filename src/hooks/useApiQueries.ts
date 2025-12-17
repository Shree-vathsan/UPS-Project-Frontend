import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../utils/api';

// Query Keys - centralized for cache invalidation
export const queryKeys = {
    repositories: (userId: string) => ['repositories', userId] as const,
    allRepositories: (userId: string, token: string) => ['allRepositories', userId, token] as const,
    analyzedRepositories: (userId: string, filter: 'your' | 'others' | 'all') => ['analyzedRepositories', userId, filter] as const,
    repository: (id: string) => ['repository', id] as const,
    repositoryStatus: (owner: string, repo: string) => ['repositoryStatus', owner, repo] as const,
    commits: (repositoryId: string) => ['commits', repositoryId] as const,
    branchCommits: (repositoryId: string, branch: string) => ['branchCommits', repositoryId, branch] as const,
    pullRequests: (repositoryId: string) => ['pullRequests', repositoryId] as const,
    pullRequestDetails: (owner: string, repo: string, prNumber: number) => ['pullRequestDetails', owner, repo, prNumber] as const,
    files: (repositoryId: string) => ['files', repositoryId] as const,
    branchFiles: (repositoryId: string, branch: string) => ['branchFiles', repositoryId, branch] as const,
    fileAnalysis: (fileId: string) => ['fileAnalysis', fileId] as const,
    file: (fileId: string) => ['file', fileId] as const,
    fileContent: (fileId: string, commitSha?: string, branch?: string) => ['fileContent', fileId, commitSha, branch] as const,
    fileCommits: (fileId: string) => ['fileCommits', fileId] as const,
    fileEnhancedAnalysis: (fileId: string) => ['fileEnhancedAnalysis', fileId] as const,
    fileSummary: (fileId: string) => ['fileSummary', fileId] as const,
    branches: (repositoryId: string) => ['branches', repositoryId] as const,
    commit: (commitId: string) => ['commit', commitId] as const,
    commitGithubDetails: (commitId: string) => ['commitGithubDetails', commitId] as const,
    repositoryAnalytics: (repositoryId: string, branch: string) => ['repositoryAnalytics', repositoryId, branch] as const,
    repositorySummary: (repositoryId: string, branch: string) => ['repositorySummary', repositoryId, branch] as const,
    teamInsights: (repositoryId: string, branch: string) => ['teamInsights', repositoryId, branch] as const,
};

// API base URL
const API_BASE = 'http://localhost:5000';

// ==================== Repository Hooks ====================

export function useAllRepositories(token: string, userId: string) {
    return useQuery({
        queryKey: queryKeys.allRepositories(userId, token),
        queryFn: () => api.getAllRepositories(token, userId),
        enabled: !!token && !!userId,
    });
}

export function useAnalyzedRepositories(userId: string, filter: 'your' | 'others' | 'all') {
    return useQuery({
        queryKey: queryKeys.analyzedRepositories(userId, filter),
        queryFn: () => api.getAnalyzedRepositories(userId, filter),
        enabled: !!userId,
    });
}

export function useRepository(repositoryId: string | undefined, token?: string) {
    return useQuery({
        queryKey: queryKeys.repository(repositoryId || ''),
        queryFn: () => api.getRepository(repositoryId!, token),
        enabled: !!repositoryId,
    });
}

export function useRepositoryStatus(owner: string, repo: string) {
    return useQuery({
        queryKey: queryKeys.repositoryStatus(owner, repo),
        queryFn: () => api.getRepositoryStatus(owner, repo),
        enabled: !!owner && !!repo,
    });
}

// ==================== Branch Hooks ====================

export function useBranches(repositoryId: string | undefined) {
    return useQuery({
        queryKey: queryKeys.branches(repositoryId || ''),
        queryFn: async () => {
            const res = await fetch(`${API_BASE}/api/repositories/${repositoryId}/branches`);
            if (!res.ok) throw new Error('Failed to fetch branches');
            return res.json();
        },
        enabled: !!repositoryId,
    });
}

// ==================== Commit Hooks ====================

export function useCommits(repositoryId: string | undefined) {
    return useQuery({
        queryKey: queryKeys.commits(repositoryId || ''),
        queryFn: () => api.getCommits(repositoryId!),
        enabled: !!repositoryId,
    });
}

export function useBranchCommits(repositoryId: string | undefined, branch: string) {
    return useQuery({
        queryKey: queryKeys.branchCommits(repositoryId || '', branch),
        queryFn: async () => {
            const res = await fetch(`${API_BASE}/api/repositories/${repositoryId}/branches/${branch}/commits`);
            if (!res.ok) throw new Error('Failed to fetch commits');
            return res.json();
        },
        enabled: !!repositoryId && !!branch,
    });
}

export function useCommit(commitId: string | undefined) {
    return useQuery({
        queryKey: queryKeys.commit(commitId || ''),
        queryFn: async () => {
            const res = await fetch(`${API_BASE}/commits/${commitId}`);
            if (!res.ok) throw new Error('Commit not found');
            return res.json();
        },
        enabled: !!commitId,
    });
}

export function useCommitGithubDetails(commitId: string | undefined) {
    return useQuery({
        queryKey: queryKeys.commitGithubDetails(commitId || ''),
        queryFn: async () => {
            const token = localStorage.getItem('token');
            const headers: Record<string, string> = {};
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            const res = await fetch(`${API_BASE}/commits/${commitId}/github-details`, { headers });
            if (!res.ok) throw new Error('Failed to fetch GitHub details');
            return res.json();
        },
        enabled: !!commitId,
    });
}

// ==================== Pull Request Hooks ====================

export function usePullRequests(repositoryId: string | undefined) {
    return useQuery({
        queryKey: queryKeys.pullRequests(repositoryId || ''),
        queryFn: () => api.getPullRequests(repositoryId!),
        enabled: !!repositoryId,
    });
}

export function usePullRequestDetails(owner: string | undefined, repo: string | undefined, prNumber: number | undefined, token?: string) {
    return useQuery({
        queryKey: queryKeys.pullRequestDetails(owner || '', repo || '', prNumber || 0),
        queryFn: () => api.getPullRequestDetails(owner!, repo!, prNumber!, token),
        enabled: !!owner && !!repo && !!prNumber,
    });
}

// ==================== File Hooks ====================

export function useFiles(repositoryId: string | undefined) {
    return useQuery({
        queryKey: queryKeys.files(repositoryId || ''),
        queryFn: () => api.getFiles(repositoryId!),
        enabled: !!repositoryId,
    });
}

export function useBranchFiles(repositoryId: string | undefined, branch: string) {
    return useQuery({
        queryKey: queryKeys.branchFiles(repositoryId || '', branch),
        queryFn: async () => {
            const res = await fetch(`${API_BASE}/api/repositories/${repositoryId}/branches/${branch}/files`);
            if (!res.ok) throw new Error('Failed to fetch files');
            return res.json();
        },
        enabled: !!repositoryId && !!branch,
    });
}

export function useFile(fileId: string | undefined) {
    return useQuery({
        queryKey: queryKeys.file(fileId || ''),
        queryFn: async () => {
            const res = await fetch(`${API_BASE}/files/${fileId}`);
            if (!res.ok) throw new Error('File not found');
            return res.json();
        },
        enabled: !!fileId,
    });
}

export function useFileAnalysis(fileId: string | undefined) {
    return useQuery({
        queryKey: queryKeys.fileAnalysis(fileId || ''),
        queryFn: () => api.getFileAnalysis(fileId!),
        enabled: !!fileId,
    });
}

export function useFileContent(fileId: string | undefined, commitSha?: string, branch?: string) {
    return useQuery({
        queryKey: queryKeys.fileContent(fileId || '', commitSha, branch),
        queryFn: async () => {
            const token = localStorage.getItem('token');
            let contentUrl = `${API_BASE}/files/${fileId}/content`;
            const params = new URLSearchParams();

            if (commitSha) {
                params.append('commitSha', commitSha);
            } else if (branch) {
                params.append('branchName', branch);
            }

            if (params.toString()) {
                contentUrl += `?${params.toString()}`;
            }

            const headers: Record<string, string> = {};
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const res = await fetch(contentUrl, { headers });
            if (!res.ok) throw new Error('Failed to fetch file content');
            return res.json();
        },
        enabled: !!fileId,
    });
}

export function useFileCommits(fileId: string | undefined) {
    return useQuery({
        queryKey: queryKeys.fileCommits(fileId || ''),
        queryFn: async () => {
            const res = await fetch(`${API_BASE}/files/${fileId}/commits`);
            if (!res.ok) throw new Error('Failed to fetch file commits');
            return res.json();
        },
        enabled: !!fileId,
    });
}

// ==================== Analytics Hooks ====================

export function useRepositoryAnalytics(repositoryId: string | undefined, branchName: string) {
    return useQuery({
        queryKey: queryKeys.repositoryAnalytics(repositoryId || '', branchName),
        queryFn: async () => {
            const res = await fetch(`${API_BASE}/repositories/${repositoryId}/analytics?branchName=${encodeURIComponent(branchName)}`);
            if (!res.ok) throw new Error('Failed to fetch analytics');
            return res.json();
        },
        enabled: !!repositoryId && !!branchName,
        staleTime: 10 * 60 * 1000, // Analytics can be stale for longer
    });
}

export function useRepositorySummary(repositoryId: string | undefined, branchName: string) {
    return useQuery({
        queryKey: queryKeys.repositorySummary(repositoryId || '', branchName),
        queryFn: async () => {
            const res = await fetch(`${API_BASE}/repositories/${repositoryId}/summary?branchName=${encodeURIComponent(branchName)}`);
            if (!res.ok) throw new Error('Failed to fetch summary');
            return res.json();
        },
        enabled: !!repositoryId && !!branchName,
        staleTime: 10 * 60 * 1000,
    });
}

export function useTeamInsights(repositoryId: string | undefined, branchName: string) {
    return useQuery({
        queryKey: queryKeys.teamInsights(repositoryId || '', branchName),
        queryFn: async () => {
            const res = await fetch(`${API_BASE}/repositories/${repositoryId}/team-insights?branchName=${encodeURIComponent(branchName)}`);
            if (!res.ok) throw new Error('Failed to fetch team insights');
            return res.json();
        },
        enabled: !!repositoryId && !!branchName,
        staleTime: 10 * 60 * 1000,
    });
}

// ==================== File Analysis Hooks ====================

export function useFileEnhancedAnalysis(fileId: string | undefined) {
    return useQuery({
        queryKey: queryKeys.fileEnhancedAnalysis(fileId || ''),
        queryFn: async () => {
            const res = await fetch(`${API_BASE}/repositories/files/${fileId}/enhanced-analysis`);
            if (!res.ok) throw new Error('Failed to fetch enhanced analysis');
            return res.json();
        },
        enabled: !!fileId,
        staleTime: 10 * 60 * 1000,
    });
}

export function useFileSummary(fileId: string | undefined) {
    return useQuery({
        queryKey: queryKeys.fileSummary(fileId || ''),
        queryFn: async () => {
            const res = await fetch(`${API_BASE}/files/${fileId}/summary`);
            if (!res.ok) throw new Error('Failed to fetch file summary');
            return res.json();
        },
        enabled: !!fileId,
        staleTime: 10 * 60 * 1000,
    });
}

// ==================== Mutation Hooks ====================

export function useAnalyzeRepository() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ owner, repo, userId, token }: { owner: string; repo: string; userId: string; token?: string }) =>
            api.analyzeRepository(owner, repo, userId, token),
        onSuccess: (_, { owner, repo, userId }) => {
            // Invalidate related queries after analysis starts
            queryClient.invalidateQueries({ queryKey: ['repositoryStatus', owner, repo] });
            queryClient.invalidateQueries({ queryKey: ['analyzedRepositories', userId] });
        },
    });
}

export function useAnalyzeRepositoryByUrl() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ url, userId, token }: { url: string; userId: string; token?: string }) =>
            api.analyzeRepositoryByUrl(url, userId, token),
        onSuccess: (_, { userId }) => {
            queryClient.invalidateQueries({ queryKey: ['analyzedRepositories', userId] });
        },
    });
}

// ==================== Cache Invalidation Helpers ====================

export function useInvalidateRepositories() {
    const queryClient = useQueryClient();

    return {
        invalidateAll: (userId: string) => {
            queryClient.invalidateQueries({ queryKey: ['repositories', userId] });
            queryClient.invalidateQueries({ queryKey: ['allRepositories', userId] });
            queryClient.invalidateQueries({ queryKey: ['analyzedRepositories', userId] });
        },
        invalidateRepository: (repositoryId: string) => {
            queryClient.invalidateQueries({ queryKey: ['repository', repositoryId] });
            queryClient.invalidateQueries({ queryKey: ['commits', repositoryId] });
            queryClient.invalidateQueries({ queryKey: ['pullRequests', repositoryId] });
            queryClient.invalidateQueries({ queryKey: ['files', repositoryId] });
            queryClient.invalidateQueries({ queryKey: ['branches', repositoryId] });
        },
    };
}
