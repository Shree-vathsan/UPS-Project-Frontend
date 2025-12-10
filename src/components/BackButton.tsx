import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BackButtonProps {
    to?: string;
    label?: string;
}

export default function BackButton({ to, label = 'Back' }: BackButtonProps) {
    const navigate = useNavigate();

    const handleClick = () => {
        if (to) {
            navigate(to);
        } else {
            navigate(-1);
        }
    };

    return (
        <Button
            onClick={handleClick}
            variant="outline"
            className="mb-6 gap-2"
        >
            <ArrowLeft className="h-4 w-4" />
            {label}
        </Button>
    );
}
