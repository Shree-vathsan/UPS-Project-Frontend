import { Button } from '@/components/ui/button';

interface PaginationProps {
    currentPage: number;
    totalPages?: number;
    onPageChange: (page: number) => void;
    disabled?: boolean;
    className?: string;
    hasNextPage?: boolean;
}

export default function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    disabled = false,
    className = '',
    hasNextPage
}: PaginationProps) {
    // If totalPages is defined and <= 1, hide it strictly.
    // if (totalPages !== undefined && totalPages <= 1) return null;

    const isNextDisabled = totalPages ? currentPage >= totalPages : !hasNextPage;

    return (
        <div className={`flex items-center justify-center gap-4 mt-6 pt-4 border-t ${className}`}>
            <Button
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1 || disabled}
                variant="outline"
                size="sm"
            >
                Previous
            </Button>
            <div className="text-sm text-muted-foreground">
                Page {currentPage}{totalPages ? ` of ${totalPages}` : ''}
            </div>
            <Button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={isNextDisabled || disabled}
                variant="outline"
                size="sm"
            >
                Next
            </Button>
        </div>
    );
}
