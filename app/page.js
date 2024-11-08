cat > app/page.js << 'EOL'
'use client';

import EtheryonCalculator from '../components/EtheryonCalculator';

export default function Home() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto p-4">
        <EtheryonCalculator />
      </div>
    </div>
  );
}
EOL
