import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

const MaxWidthWrapper = ({
    className,
    children,
}: {
    className?: string;
    children: ReactNode;
}) => {
    return (
        <div
            className={cn(
                className,
                'mx-auto w-full max-w-screen-xl px-5 md:px-20'
            )}
        >
            {children}
        </div>
    );
};

export default MaxWidthWrapper;
