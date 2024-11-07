'use client';

export default function Home() {
  const EtheryonCalculator = require('../components/EtheryonCalculator').default;
  
  return (
    <div className="min-h-screen">
      <EtheryonCalculator />
    </div>
  );
}
