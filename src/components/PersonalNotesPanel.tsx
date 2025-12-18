import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { BookMarked, Plus, Trash2, Edit2, X, Check, Hash, Users, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
    useFilePersonalNotes, useCreateFilePersonalNote, useUpdatePersonalNote, useDeletePersonalNote,
    useLineCommentsForFile, useCreateLineComment
} from '@/hooks/useApiQueries';
import { formatDistanceToNow } from 'date-fns';

interface PersonalNotesPanelProps {
    fileId: string;
    repositoryId?: string;
    onLineClick?: (lineNumber: number) => void;
}

interface PersonalNote {
    id: string;
    content: string;
    lineNumber?: number;
    createdAt: string;
    updatedAt: string;
}

interface SharedNote {
    id: string;
    commentText: string;
    lineNumber?: number;
    createdAt: string;
    createdByUserId: string;
    createdByUsername: string;
    isShared: boolean;
}

// ============================================
// MAIN PANEL - Renders both sections
// ============================================

export function PersonalNotesPanel({ fileId, repositoryId, onLineClick }: PersonalNotesPanelProps) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user?.id;

    return (
        <div className="space-y-4 w-full">
            {/* Section 1: Personal Notes - Top */}
            <PersonalNotesSection
                fileId={fileId}
                userId={userId}
                onLineClick={onLineClick}
            />

            {/* Section 2: Shared Notes - Bottom */}
            <SharedNotesSection
                fileId={fileId}
                repositoryId={repositoryId}
                userId={userId}
                onLineClick={onLineClick}
            />
        </div>
    );
}

// ============================================
// PERSONAL NOTES SECTION - Completely Independent
// ============================================

function PersonalNotesSection({
    fileId,
    userId,
    onLineClick
}: {
    fileId: string;
    userId: string;
    onLineClick?: (lineNumber: number) => void;
}) {
    // Independent state for Personal Notes
    const [isAdding, setIsAdding] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [searchLineNumber, setSearchLineNumber] = useState('');
    const [newContent, setNewContent] = useState('');
    const [newLineNumber, setNewLineNumber] = useState('');
    const [lineNumberError, setLineNumberError] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editContent, setEditContent] = useState('');
    const [editLineNumber, setEditLineNumber] = useState('');

    // Personal notes data hooks
    const { data: notes, isLoading } = useFilePersonalNotes(fileId, userId);
    const createNote = useCreateFilePersonalNote();
    const updateNote = useUpdatePersonalNote();
    const deleteNote = useDeletePersonalNote();

    const notesData = (notes as PersonalNote[] || []);

    // Filter notes by line number search - PREFIX MATCH (like phone search)
    const filteredNotes = useMemo(() => {
        if (!searchLineNumber.trim()) return notesData;

        // Prefix match: line number must START WITH the search string
        return notesData.filter(note => {
            if (!note.lineNumber) return false;
            // Convert line number to string and check if it starts with the search string
            return note.lineNumber.toString().startsWith(searchLineNumber.trim());
        });
    }, [notesData, searchLineNumber]);

    // Create personal note with mandatory line number
    const handleCreate = async () => {
        if (!newContent.trim() || !userId) return;

        // Validate mandatory line number
        if (!newLineNumber.trim()) {
            setLineNumberError('Line number is required');
            return;
        }

        const lineNum = parseInt(newLineNumber);
        if (isNaN(lineNum) || lineNum < 1) {
            setLineNumberError('Please enter a valid line number');
            return;
        }

        await createNote.mutateAsync({
            userId,
            data: {
                fileId,
                content: newContent,
                lineNumber: lineNum
            }
        });

        setNewContent('');
        setNewLineNumber('');
        setLineNumberError('');
        setIsAdding(false);
    };

    const handleStartEdit = (note: PersonalNote) => {
        setEditingId(note.id);
        setEditContent(note.content);
        setEditLineNumber(note.lineNumber?.toString() || '');
    };

    const handleSaveEdit = async () => {
        if (!editContent.trim() || !editingId || !userId) return;

        await updateNote.mutateAsync({
            noteId: editingId,
            userId,
            data: {
                content: editContent,
                lineNumber: editLineNumber ? parseInt(editLineNumber) : undefined
            },
            fileId
        });
        setEditingId(null);
        setEditContent('');
        setEditLineNumber('');
    };

    const handleDelete = async (noteId: string) => {
        if (!userId) return;
        await deleteNote.mutateAsync({ noteId, userId, fileId });
    };

    const handleCancelAdd = () => {
        setIsAdding(false);
        setNewContent('');
        setNewLineNumber('');
        setLineNumberError('');
    };

    return (
        <Card className="w-full bg-gradient-to-br from-purple-900/30 via-slate-800/60 to-slate-900/80 border-purple-500/40 backdrop-blur-sm shadow-xl shadow-purple-500/10">
            <CardHeader className="pb-3 bg-gradient-to-r from-purple-500/15 to-transparent border-b border-purple-500/20">
                <CardTitle className="flex items-center justify-between text-base text-white">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-purple-500/20 backdrop-blur-sm">
                            <BookMarked className="h-4 w-4 text-purple-400" />
                        </div>
                        <span className="font-semibold tracking-tight">Personal Notes</span>
                        <span className="text-xs text-slate-400">({notesData.length})</span>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Search Toggle */}
                        <Button
                            onClick={() => {
                                setIsSearching(!isSearching);
                                if (isSearching) setSearchLineNumber('');
                            }}
                            size="sm"
                            variant="ghost"
                            className={`h-8 w-8 p-0 ${isSearching ? 'text-purple-400 bg-purple-500/20' : 'text-slate-400 hover:text-purple-300'}`}
                        >
                            <Search className="h-4 w-4" />
                        </Button>
                        {/* Add Note Button */}
                        {!isAdding && (
                            <Button
                                onClick={() => setIsAdding(true)}
                                size="sm"
                                className="h-8 px-3 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 hover:text-purple-200 border border-purple-500/30 hover:border-purple-500/50 transition-all duration-200"
                            >
                                <Plus className="h-3 w-3 mr-1" />
                                Add Note
                            </Button>
                        )}
                    </div>
                </CardTitle>
            </CardHeader>

            <CardContent className="p-4 space-y-3">
                {/* Search Input */}
                {isSearching && (
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/50 border border-purple-500/30">
                        <Hash className="h-4 w-4 text-purple-400" />
                        <Input
                            type="text"
                            placeholder="Search by line number (e.g., 3 shows L3, L30, L31...)"
                            value={searchLineNumber}
                            onChange={(e) => setSearchLineNumber(e.target.value)}
                            className="flex-1 h-7 bg-transparent border-0 text-white text-sm focus:ring-0 placeholder:text-slate-400"
                            autoFocus
                        />
                        {searchLineNumber && (
                            <Button
                                onClick={() => setSearchLineNumber('')}
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0 text-slate-400 hover:text-slate-200"
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        )}
                    </div>
                )}

                {/* Add Note Form */}
                {isAdding && (
                    <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/15 to-purple-900/10 border border-purple-500/30 space-y-3 animate-in slide-in-from-top-2 duration-200">
                        <Textarea
                            placeholder="Write your private note..."
                            value={newContent}
                            onChange={(e) => setNewContent(e.target.value)}
                            className="min-h-[70px] bg-slate-800/60 border-purple-500/30 text-white placeholder:text-slate-400 text-sm focus:border-purple-400 focus:ring-purple-400/20 rounded-lg"
                            autoFocus
                        />
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 rounded-md bg-slate-700/50">
                                    <Hash className="h-3.5 w-3.5 text-purple-400" />
                                </div>
                                <Input
                                    type="number"
                                    placeholder="Line # (required)"
                                    value={newLineNumber}
                                    onChange={(e) => {
                                        setNewLineNumber(e.target.value);
                                        setLineNumberError('');
                                    }}
                                    className={`flex-1 h-8 bg-slate-800/60 text-white text-sm rounded-lg ${lineNumberError ? 'border-red-500/50' : 'border-slate-600/50'}`}
                                />
                            </div>
                            {lineNumberError && (
                                <p className="text-xs text-red-400 ml-9">{lineNumberError}</p>
                            )}
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button
                                onClick={handleCancelAdd}
                                size="sm"
                                variant="ghost"
                                className="h-7 px-3 text-slate-400 hover:text-slate-200"
                            >
                                <X className="h-3 w-3 mr-1" />
                                Cancel
                            </Button>
                            <Button
                                onClick={handleCreate}
                                disabled={!newContent.trim() || createNote.isPending}
                                size="sm"
                                className="h-7 px-4 bg-purple-500 hover:bg-purple-600 shadow-lg shadow-purple-500/25 transition-all duration-200"
                            >
                                <Check className="h-3 w-3 mr-1" />
                                Save
                            </Button>
                        </div>
                    </div>
                )}

                {/* Notes List */}
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-purple-500/40 scrollbar-track-transparent hover:scrollbar-thumb-purple-400/60">
                    {isLoading ? (
                        <div className="text-center py-6 text-slate-400 text-sm">
                            <div className="animate-pulse">Loading...</div>
                        </div>
                    ) : filteredNotes.length === 0 ? (
                        <div className="text-center py-8 text-slate-400 text-sm">
                            <div className="p-3 rounded-full bg-slate-800/50 w-fit mx-auto mb-3">
                                <BookMarked className="h-6 w-6 text-slate-500" />
                            </div>
                            {searchLineNumber ? (
                                <p>No notes found matching line "{searchLineNumber}"</p>
                            ) : (
                                <>
                                    <p>No personal notes yet.</p>
                                    <button
                                        onClick={() => setIsAdding(true)}
                                        className="text-purple-400 hover:text-purple-300 mt-2 font-medium transition-colors"
                                    >
                                        Add your first note
                                    </button>
                                </>
                            )}
                        </div>
                    ) : (
                        filteredNotes.map((note) => (
                            <div
                                key={note.id}
                                className={`p-3 rounded-xl bg-gradient-to-br from-slate-800/70 to-slate-900/50 border transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/5 group ${searchLineNumber && note.lineNumber?.toString().startsWith(searchLineNumber.trim())
                                    ? 'border-purple-500/60 ring-1 ring-purple-500/30'
                                    : 'border-slate-700/50 hover:border-purple-500/30'
                                    }`}
                            >
                                {editingId === note.id ? (
                                    <div className="space-y-2">
                                        <Textarea
                                            value={editContent}
                                            onChange={(e) => setEditContent(e.target.value)}
                                            className="min-h-[50px] bg-slate-700/50 border-slate-600/50 text-white text-sm rounded-lg"
                                        />
                                        <div className="flex items-center gap-2">
                                            <Hash className="h-3 w-3 text-slate-400" />
                                            <Input
                                                type="number"
                                                placeholder="Line #"
                                                value={editLineNumber}
                                                onChange={(e) => setEditLineNumber(e.target.value)}
                                                className="flex-1 h-6 bg-slate-700/50 border-slate-600/50 text-white text-xs rounded-lg"
                                            />
                                        </div>
                                        <div className="flex justify-end gap-1">
                                            <Button
                                                onClick={() => setEditingId(null)}
                                                size="sm"
                                                variant="ghost"
                                                className="h-6 text-xs text-slate-400"
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                onClick={handleSaveEdit}
                                                disabled={!editContent.trim() || updateNote.isPending}
                                                size="sm"
                                                className="h-6 text-xs bg-purple-500 hover:bg-purple-600"
                                            >
                                                Save
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex items-start justify-between gap-1">
                                            {note.lineNumber && (
                                                <button
                                                    onClick={() => onLineClick?.(note.lineNumber!)}
                                                    className="px-2 py-0.5 text-xs rounded-md bg-purple-500/25 text-purple-300 hover:bg-purple-500/40 transition-colors font-mono"
                                                >
                                                    L{note.lineNumber}
                                                </button>
                                            )}
                                            <div className="flex-1" />
                                            <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleStartEdit(note)}
                                                    className="h-6 w-6 p-0 text-slate-400 hover:text-purple-300 hover:bg-purple-500/20"
                                                >
                                                    <Edit2 className="h-3 w-3" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDelete(note.id)}
                                                    className="h-6 w-6 p-0 text-slate-400 hover:text-red-400 hover:bg-red-500/20"
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </div>
                                        <p className="mt-2 text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">{note.content}</p>
                                        <p className="mt-2 text-xs text-slate-500">
                                            {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
                                        </p>
                                    </>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

// ============================================
// SHARED NOTES SECTION - Completely Independent
// ============================================

function SharedNotesSection({
    fileId,
    repositoryId,
    userId,
    onLineClick
}: {
    fileId: string;
    repositoryId?: string;
    userId: string;
    onLineClick?: (lineNumber: number) => void;
}) {
    // Independent state for Shared Notes
    const [filter, setFilter] = useState<'all' | 'you' | 'others'>('all');
    const [isAdding, setIsAdding] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [searchLineNumber, setSearchLineNumber] = useState('');
    const [newContent, setNewContent] = useState('');
    const [newLineNumber, setNewLineNumber] = useState('');
    const [lineNumberError, setLineNumberError] = useState('');

    // Shared notes data hooks
    const { data: lineComments, isLoading } = useLineCommentsForFile(fileId, userId);
    const createLineComment = useCreateLineComment();

    const sharedNotesData = (lineComments || []).filter((comment: any) => comment.isShared) as SharedNote[];

    // Filter and sort shared notes
    const filteredAndSortedNotes = useMemo(() => {
        let filtered = sharedNotesData;

        // Apply All/You/Others filter
        if (filter === 'you') {
            filtered = sharedNotesData.filter(note => note.createdByUserId === userId);
        } else if (filter === 'others') {
            filtered = sharedNotesData.filter(note => note.createdByUserId !== userId);
        }
        // 'all' shows everything

        // Apply line number search filter (prefix match - like phone search)
        if (searchLineNumber.trim()) {
            filtered = filtered.filter(note => {
                if (!note.lineNumber) return false;
                return note.lineNumber.toString().startsWith(searchLineNumber.trim());
            });
        }

        // Sort by createdAt descending (most recent first)
        return [...filtered].sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }, [sharedNotesData, filter, userId, searchLineNumber]);

    // Create shared note
    const handleCreate = async () => {
        if (!newContent.trim() || !userId || !repositoryId) return;

        // Validate mandatory line number
        if (!newLineNumber.trim()) {
            setLineNumberError('Line number is required');
            return;
        }

        const lineNum = parseInt(newLineNumber);
        if (isNaN(lineNum) || lineNum < 1) {
            setLineNumberError('Please enter a valid line number');
            return;
        }

        await createLineComment.mutateAsync({
            userId,
            data: {
                repositoryId,
                fileId,
                lineNumber: lineNum,
                commentText: newContent,
                isShared: true
            }
        });

        setNewContent('');
        setNewLineNumber('');
        setLineNumberError('');
        setIsAdding(false);
    };

    const handleCancelAdd = () => {
        setIsAdding(false);
        setNewContent('');
        setNewLineNumber('');
        setLineNumberError('');
    };

    return (
        <Card className="w-full bg-gradient-to-br from-blue-900/30 via-slate-800/60 to-slate-900/80 border-blue-500/40 backdrop-blur-sm shadow-xl shadow-blue-500/10">
            <CardHeader className="pb-3 bg-gradient-to-r from-blue-500/15 to-transparent border-b border-blue-500/20">
                <CardTitle className="flex items-center justify-between text-base text-white">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-blue-500/20 backdrop-blur-sm">
                            <Users className="h-4 w-4 text-blue-400" />
                        </div>
                        <span className="font-semibold tracking-tight">Shared Notes</span>
                        <span className="text-xs text-slate-400">({sharedNotesData.length})</span>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Search Toggle */}
                        <Button
                            onClick={() => {
                                setIsSearching(!isSearching);
                                if (isSearching) setSearchLineNumber('');
                            }}
                            size="sm"
                            variant="ghost"
                            className={`h-8 w-8 p-0 ${isSearching ? 'text-blue-400 bg-blue-500/20' : 'text-slate-400 hover:text-blue-300'}`}
                        >
                            <Search className="h-4 w-4" />
                        </Button>

                        {/* Filter Dropdown */}
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value as 'all' | 'you' | 'others')}
                            className="h-8 px-1 bg-slate-800/70 border border-slate-700/50 rounded-md text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 cursor-pointer"
                        >
                            <option value="all" className="bg-slate-800">All</option>
                            <option value="you" className="bg-slate-800">You</option>
                            <option value="others" className="bg-slate-800">Others</option>
                        </select>

                        {/* Add Note Button */}
                        {!isAdding && (
                            <Button
                                onClick={() => setIsAdding(true)}
                                size="sm"
                                className="h-8 px-3 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 hover:text-blue-200 border border-blue-500/30 hover:border-blue-500/50 transition-all duration-200"
                            >
                                <Plus className="h-3 w-3 mr-1" />
                                Add Note
                            </Button>
                        )}
                    </div>
                </CardTitle>
            </CardHeader>

            <CardContent className="p-4 space-y-3">
                {/* Search Input */}
                {isSearching && (
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/50 border border-blue-500/30">
                        <Hash className="h-4 w-4 text-blue-400" />
                        <Input
                            type="text"
                            placeholder="Search by line number (e.g., 3 shows L3, L30, L31...)"
                            value={searchLineNumber}
                            onChange={(e) => setSearchLineNumber(e.target.value)}
                            className="flex-1 h-7 bg-transparent border-0 text-white text-sm focus:ring-0 placeholder:text-slate-400"
                            autoFocus
                        />
                        {searchLineNumber && (
                            <Button
                                onClick={() => setSearchLineNumber('')}
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0 text-slate-400 hover:text-slate-200"
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        )}
                    </div>
                )}

                {/* Add Shared Note Form */}
                {isAdding && (
                    <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/15 to-blue-900/10 border border-blue-500/30 space-y-3 animate-in slide-in-from-top-2 duration-200">
                        <Textarea
                            placeholder="Share a note with your team..."
                            value={newContent}
                            onChange={(e) => setNewContent(e.target.value)}
                            className="min-h-[70px] bg-slate-800/60 border-blue-500/30 text-white placeholder:text-slate-400 text-sm focus:border-blue-400 focus:ring-blue-400/20 rounded-lg"
                            autoFocus
                        />
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 rounded-md bg-slate-700/50">
                                    <Hash className="h-3.5 w-3.5 text-blue-400" />
                                </div>
                                <Input
                                    type="number"
                                    placeholder="Line # (required)"
                                    value={newLineNumber}
                                    onChange={(e) => {
                                        setNewLineNumber(e.target.value);
                                        setLineNumberError('');
                                    }}
                                    className={`flex-1 h-8 bg-slate-800/60 text-white text-sm rounded-lg ${lineNumberError ? 'border-red-500/50' : 'border-slate-600/50'}`}
                                />
                            </div>
                            {lineNumberError && (
                                <p className="text-xs text-red-400 ml-9">{lineNumberError}</p>
                            )}
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button
                                onClick={handleCancelAdd}
                                size="sm"
                                variant="ghost"
                                className="h-7 px-3 text-slate-400 hover:text-slate-200"
                            >
                                <X className="h-3 w-3 mr-1" />
                                Cancel
                            </Button>
                            <Button
                                onClick={handleCreate}
                                disabled={!newContent.trim() || createLineComment.isPending}
                                size="sm"
                                className="h-7 px-4 bg-blue-500 hover:bg-blue-600 shadow-lg shadow-blue-500/25 transition-all duration-200"
                            >
                                <Check className="h-3 w-3 mr-1" />
                                Share
                            </Button>
                        </div>
                    </div>
                )}

                {/* Shared Notes List */}
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-blue-500/40 scrollbar-track-transparent hover:scrollbar-thumb-blue-400/60">
                    {isLoading ? (
                        <div className="text-center py-6 text-slate-400 text-sm">
                            <div className="animate-pulse">Loading...</div>
                        </div>
                    ) : filteredAndSortedNotes.length === 0 ? (
                        <div className="text-center py-8 text-slate-400 text-sm">
                            <div className="p-3 rounded-full bg-slate-800/50 w-fit mx-auto mb-3">
                                <Users className="h-6 w-6 text-slate-500" />
                            </div>
                            <p>
                                {searchLineNumber
                                    ? `No notes found matching line "${searchLineNumber}"`
                                    : filter === 'all' && 'No shared notes yet.'}
                                {!searchLineNumber && filter === 'you' && 'You haven\'t shared any notes yet.'}
                                {!searchLineNumber && filter === 'others' && 'No notes from others yet.'}
                            </p>
                            {!searchLineNumber && filter !== 'others' && (
                                <button
                                    onClick={() => setIsAdding(true)}
                                    className="text-blue-400 hover:text-blue-300 mt-2 font-medium transition-colors"
                                >
                                    Share your first note
                                </button>
                            )}
                        </div>
                    ) : (
                        filteredAndSortedNotes.map((note) => {
                            const isMyNote = note.createdByUserId === userId;
                            const matchesSearch = searchLineNumber && note.lineNumber?.toString().startsWith(searchLineNumber.trim());

                            return (
                                <div
                                    key={note.id}
                                    className={`p-3 rounded-xl border transition-all duration-200 hover:shadow-lg ${matchesSearch ? 'ring-1 ring-blue-500/30' : ''} ${isMyNote
                                        ? 'bg-gradient-to-br from-blue-900/30 to-blue-950/20 border-blue-600/40 hover:border-blue-500/60 hover:shadow-blue-500/10'
                                        : 'bg-gradient-to-br from-slate-800/70 to-slate-900/50 border-slate-700/50 hover:border-slate-600/70 hover:shadow-slate-500/5'
                                        }`}
                                >
                                    {/* Header with author and line number */}
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            {/* Author badge */}
                                            {isMyNote ? (
                                                <Badge variant="default" className="text-xs bg-blue-500 text-white border-0 shadow-sm">
                                                    You
                                                </Badge>
                                            ) : (
                                                <Badge variant="secondary" className="text-xs bg-purple-500/25 text-purple-300 border-purple-500/40">
                                                    {note.createdByUsername}
                                                </Badge>
                                            )}

                                            {/* Line number */}
                                            {note.lineNumber && note.lineNumber > 0 && (
                                                <button
                                                    onClick={() => onLineClick?.(note.lineNumber!)}
                                                    className="px-2 py-0.5 text-xs rounded-md bg-slate-700/60 text-slate-300 hover:bg-slate-600/60 transition-colors font-mono"
                                                >
                                                    L{note.lineNumber}
                                                </button>
                                            )}
                                        </div>

                                        {/* Timestamp */}
                                        <span className="text-xs text-slate-500">
                                            {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}
                                        </span>
                                    </div>

                                    {/* Message content */}
                                    <p className="text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
                                        {note.commentText}
                                    </p>
                                </div>
                            );
                        })
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

export default PersonalNotesPanel;
