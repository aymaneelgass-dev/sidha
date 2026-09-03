import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export function HeaderSearch() {
    return (
        <div role="search" aria-label="Search SIDHA" className="relative">
            <Search
                className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
                aria-hidden="true"
            />
            <Input
                type="search"
                aria-label="Search SIDHA"
                placeholder="Search SIDHA"
                className="bg-background h-9 pl-9"
                onKeyDown={(event) => {
                    if (event.key === 'Enter') event.preventDefault();
                }}
            />
        </div>
    );
}
