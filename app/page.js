'use client';

import { Suspense } from 'react';
import EtheryonCalculator from '@/components/EtheryonCalculator';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Suspense fallback={<div>Chargement...</div>}>
        <EtheryonCalculator />
      </Suspense>
    </div>
  );
}
