import EtheryonCalculator from '@/components/calculator/EtheryonCalculator'
import { Card } from '@/components/ui/card'

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <Card className="p-6">
        <h1 className="text-3xl font-bold mb-4">Calculatrice Etheryon</h1>
        <EtheryonCalculator />
      </Card>
    </div>
  )
}
