import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="py-4 px-6 md:px-8 flex justify-between items-center border-b sticky top-0 bg-background/95 backdrop-blur-sm z-10">
      <Link href="/">
        <div className="flex items-center gap-2 cursor-pointer" title="Home">
            <h1 className="font-headline text-3xl text-primary">RoomieVibe</h1>
        </div>
      </Link>
      <nav className="flex items-center gap-2">
        <Button asChild>
          <Link href="/profile">Find Matches</Link>
        </Button>
      </nav>
    </header>
  );
}
