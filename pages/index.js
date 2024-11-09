'use client'

import React from 'react'
import { motion } from 'framer-motion'
import EtheryonCalculator from '@/components/calculator/EtheryonCalculator'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useTheme } from 'next-themes'

export default function Home() {
  const { theme } = useTheme()

  return (
    <div className={`min-h-screen bg-background ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="container mx-auto p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="w-full max-w-4xl mx-auto">
            <EtheryonCalculator />
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
