import dynamic from 'next/dynamic';

const EtheryonCalculator = dynamic(() => import('../components/EtheryonCalculator'), {
  ssr: false
});

export default function Home() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto p-4">
        <EtheryonCalculator />
      </div>
    </div>
  );
}
