import { ChartCandlestickIcon } from 'lucide-react';
import Link from 'next/link';
import React, { ReactNode } from 'react';

function layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <header className="px-4 md:px-6">
        <Link href="#" className="mr-6 hidden lg:flex" prefetch={false}>
          <ChartCandlestickIcon className="h-6 w-6" />
          <h1 className="ml-2">ROBINHOOD</h1>
        </Link>
      </header>
      {children}
    </div>
  );
}

export default layout;
