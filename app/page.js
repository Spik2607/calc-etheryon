<<<<<<< HEAD
cat > app/page.js << 'EOL'
'use client';

import EtheryonCalculator from '../components/EtheryonCalculator';
=======
'use client';
>>>>>>> d69ab4f226bcf2946ee92f93306c6d6fadbdb294

import EtheryonCalculator from '@/components/EtheryonCalculator';

export default function Page() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto p-4">
        <EtheryonCalculator />
      </div>
    </div>
  );
}
EOL
