import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { BookMarked, Plus, Trash2, Edit2, X, Check, Hash, MessageSquare, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
    useFilePersonalNotes, useCreateFilePersonalNote, useUpdatePersonalNote, useDeletePersonalNote,
    useLineCommentsForFile, useCreateLineComment, useUpdateLineComment, useDeleteLineComment
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

export function PersonalNotesPanel({ fileId, repositoryId, onLineClick }: PersonalNotesPanelProps) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user?.id;

    const [activeTab, setActiveTab] = useState<'personal' | 'shared'>('personal');
    const [isAdding, setIsAdding] = useState(false);
    const [newContent, setNewContent] = useState('');
    const [newLineNumber, setNewLineNumber] = useState<string>('');
    const [isShared, setIsShared] = useState(false); // New state for shared toggle
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editContent, setEditContent] = useState('');
    const [editLineNumber, setEditLineNumber] = useState<string>('');

    const { data: notes, isLoading } = useFilePersonalNotes(fileId, userId);
    const { data: lineComments, isLoading: lineCommentsLoading } = useLineCommentsForFile(fileId, userId);
    const createNote = useCreateFilePersonalNote();
    const createLineComment = useCreateLineComment();
    const updateNote = useUpdatePersonalNote();
    const deleteNote = useDeletePersonalNote();

    const handleCreate = async () => {
        if (!newContent.trim() || !userId || !repositoryId) return;

        if (isShared) {
            // Create shared note using line comments API
            await createLineComment.mutateAsync({
                userId,
                data: {
                    repositoryId,
                    fileId,
                    lineNumber: newLineNumber ? parseInt(newLineNumber) : 0,
                    commentText: newContent,
                    isShared: true
                }
            });
        } else {
            // Create personal note
            await createNote.mutateAsync({
                userId,
                data: {
                    fileId,
                    content: newContent,
                    lineNumber: newLineNumber ? parseInt(newLineNumber) : undefined
                }
            });
        }

        setNewContent('');
        setNewLineNumber('');
        setIsShared(false);
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

    const notesData = (notes as PersonalNote[] || []);
    const sharedNotesData = (lineComments || []).filter((comment: any) => comment.isShared);

    return (
        <Card className="w-full bg-gradient-to-br from-purple-900/20 to-slate-800/50 border-purple-500/30 h-fit max-h-[calc(100vh-200px)] overflow-hidden flex flex-col">
            <CardHeader className="pb-3 bg-purple-500/10 flex-shrink-0">
                <CardTitle className="flex items-center justify-between text-base text-white">
                    <div className="flex items-center gap-2">
                        <BookMarked className="h-5 w-5 text-purple-400" />
                        <span>Notes</span>
                    </div>
                    {!isAdding && (
                        <Button
                            onClick={() => setIsAdding(true)}
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-purple-400 hover:text-purple-300 hover:bg-purple-500/20"
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    )}
                </CardTitle>

                {/* Tabs for Personal vs Shared */}
                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'personal' | 'shared')} className="mt-2">
                    <TabsList className="grid w-full grid-cols-2 bg-slate-800/50">
                        <TabsTrigger value="personal" className="text-xs">
                            <BookMarked className="h-3 w-3 mr-1" />
                            Personal ({notesData.length})
                        </TabsTrigger>
                        <TabsTrigger value="shared" className="text-xs">
                            <Users className="h-3 w-3 mr-1" />
                            Shared ({sharedNotesData.length})
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="personal" className="mt-0">
                        <CardContent className="space-y-3 p-0 pt-3">
                            {/* Add Note Form */}
                            {isAdding && (
                                <div className={`p-3 rounded-lg border space-y-2 ${isShared ? 'bg-blue-500/10 border-blue-500/30' : 'bg-purple-500/10 border-purple-500/30'}`}>
                                    {/* Shared/Personal Toggle */}
                                    <div className="flex items-center gap-2 mb-2">
                                        <Button
                                            onClick={() => setIsShared(false)}
                                            size="sm"
                                            variant={!isShared ? "default" : "ghost"}
                                            className={`flex-1 h-7 text-xs ${!isShared ? 'bg-purple-500 hover:bg-purple-600' : 'text-slate-400'}`}
                                        >
                                            <BookMarked className="h-3 w-3 mr-1" />
                                            Personal (Only You)
                                        </Button>
                                        <Button
                                            onClick={() => setIsShared(true)}
                                            size="sm"
                                            variant={isShared ? "default" : "ghost"}
                                            className={`flex-1 h-7 text-xs ${isShared ? 'bg-blue-500 hover:bg-blue-600' : 'text-slate-400'}`}
                                        >
                                            <Users className="h-3 w-3 mr-1" />
                                            Shared (Visible to All)
                                        </Button>
                                    </div>

                                    <Textarea
                                        placeholder={isShared ? "Share a note with your team..." : "Write your private note..."}
                                        value={newContent}
                                        onChange={(e) => setNewContent(e.target.value)}
                                        className="min-h-[60px] bg-slate-800/50 border-slate-600/50 text-white placeholder:text-slate-400 text-sm"
                                    />
                                    <div className="flex items-center gap-2">
                                        <Hash className="h-4 w-4 text-slate-400" />
                                        <Input
                                            type="number"
                                            placeholder="Line # (optional)"
                                            value={newLineNumber}
                                            onChange={(e) => setNewLineNumber(e.target.value)}
                                            className="flex-1 h-8 bg-slate-800/50 border-slate-600/50 text-white text-sm"
                                        />
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            onClick={() => { setIsAdding(false); setNewContent(''); setNewLineNumber(''); }}
                                            size="sm"
                                            variant="ghost"
                                            className="h-7 text-slate-400"
                                        >
                                            <X className="h-3 w-3 mr-1" />
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={handleCreate}
                                            disabled={!newContent.trim() || createNote.isPending}
                                            size="sm"
                                            className="h-7 bg-purple-500 hover:bg-purple-600"
                                        >
                                            <Check className="h-3 w-3 mr-1" />
                                            Save
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Notes List */}
                            <div className="space-y-2 max-h-[400px] overflow-y-auto">
                                {isLoading ? (
                                    <div className="text-center py-4 text-slate-400 text-sm">Loading...</div>
                                ) : notesData.length === 0 && !isAdding ? (
                                    <div className="text-center py-4 text-slate-400 text-sm">
                                        No personal notes yet.
                                        <br />
                                        <button
                                            onClick={() => setIsAdding(true)}
                                            className="text-purple-400 hover:text-purple-300 mt-1"
                                        >
                                            Add your first note
                                        </button>
                                    </div>
                                ) : (
                                    notesData.map((note) => (
                                        <div key={note.id} className="p-2 rounded-lg bg-slate-800/50 border border-slate-700/50">
                                            {editingId === note.id ? (
                                                <div className="space-y-2">
                                                    <Textarea
                                                        value={editContent}
                                                        onChange={(e) => setEditContent(e.target.value)}
                                                        className="min-h-[50px] bg-slate-700/50 border-slate-600/50 text-white text-sm"
                                                    />
                                                    <div className="flex items-center gap-2">
                                                        <Hash className="h-3 w-3 text-slate-400" />
                                                        <Input
                                                            type="number"
                                                            placeholder="Line #"
                                                            value={editLineNumber}
                                                            onChange={(e) => setEditLineNumber(e.target.value)}
                                                            className="flex-1 h-6 bg-slate-700/50 border-slate-600/50 text-white text-xs"
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
                                                                className="px-1.5 py-0.5 text-xs rounded bg-purple-500/20 text-purple-300 hover:bg-purple-500/30"
                                                            >
                                                                L{note.lineNumber}
                                                            </button>
                                                        )}
                                                        <div className="flex-1" />
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleStartEdit(note)}
                                                            className="h-5 w-5 p-0 text-slate-400 hover:text-slate-200"
                                                        >
                                                            <Edit2 className="h-3 w-3" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleDelete(note.id)}
                                                            className="h-5 w-5 p-0 text-slate-400 hover:text-red-400"
                                                        >
                                                            <Trash2 className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                    <p className="mt-1 text-xs text-slate-200 whitespace-pre-wrap">{note.content}</p>
                                                    <p className="mt-1 text-xs text-slate-500">
                                                        {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
                                                    </p>
                                                </>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </TabsContent>

                    {/* Shared Tab */}
                    <TabsContent value="shared" className="mt-0">
                        <CardContent className="space-y-3 p-0 pt-3">
                            <div className="space-y-3 max-h-[400px] overflow-y-auto">
                                {lineCommentsLoading ? (
                                    <div className="text-center py-4 text-slate-400 text-sm">Loading...</div>
                                ) : sharedNotesData.length === 0 ? (
                                    <div className="text-center py-4 text-slate-400 text-sm">
                                        No shared notes yet.
                                        <br />
                                        <span className="text-xs">Toggle "Shared" when adding a note to share it with your team.</span>
                                    </div>
                                ) : (
                                    sharedNotesData.map((comment: any) => {
                                        const isMyNote = comment.createdByUserId === userId;

                                        return (
                                            <div key={comment.id} className={`p-3 rounded-lg border ${isMyNote
                                                    ? 'bg-blue-900/20 border-blue-700/50 ml-8' // My notes: indented right
                                                    : 'bg-slate-800/50 border-slate-700/50 mr-8' // Others: indented left
                                                }`}>
                                                {/* Header with author and line number */}
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        {/* Author badge */}
                                                        {isMyNote ? (
                                                            <Badge variant="default" className="text-xs bg-blue-500 text-white border-0">
                                                                You
                                                            </Badge>
                                                        ) : (
                                                            <Badge variant="secondary" className="text-xs bg-purple-500/20 text-purple-300 border-purple-500/30">
                                                                {comment.createdByUsername}
                                                            </Badge>
                                                        )}

                                                        {/* Line number */}
                                                        {comment.lineNumber && comment.lineNumber > 0 && (
                                                            <button
                                                                onClick={() => onLineClick?.(comment.lineNumber!)}
                                                                className="px-1.5 py-0.5 text-xs rounded bg-slate-700/50 text-slate-300 hover:bg-slate-600/50"
                                                            >
                                                                L{comment.lineNumber}
                                                            </button>
                                                        )}
                                                    </div>

                                                    {/* Timestamp */}
                                                    <span className="text-xs text-slate-500">
                                                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                                                    </span>
                                                </div>

                                                {/* Message content */}
                                                <p className="text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
                                                    {comment.commentText}
                                                </p>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </CardContent>
                    </TabsContent>
                </Tabs>
            </CardHeader>
        </Card>
    );
}

export default PersonalNotesPanel;
