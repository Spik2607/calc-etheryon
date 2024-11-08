import EtheryonCalculator from '@/components/calculator/EtheryonCalculator'
import { Card } from '@/components/ui/card'
import React from 'react'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto p-4">
        <EtheryonCalculator />
      </div>
    </div>
  )
}
