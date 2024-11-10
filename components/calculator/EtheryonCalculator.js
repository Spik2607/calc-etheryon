'use client'

import React, { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Shield, Sword, Star, Crown, Heart } from 'lucide-react'

// Configuration des éléments
const elements = [
  { name: 'Eau', icon: '💧', bgColor: 'bg-blue-500', textColor: 'text-white' },
  { name: 'Feu', icon: '🔥', bgColor: 'bg-red-500', textColor: 'text-white' },
  { name: 'Terre', icon: '🌍', bgColor: 'bg-green-500', textColor: 'text-white' },
  { name: 'Air', icon: '🌪️', bgColor: 'bg-gray-500', textColor: 'text-white' },
  { name: 'Foudre', icon: '⚡', bgColor: 'bg-yellow-500', textColor: 'text-black' }
]

const MAX_PLAYERS = 8
const MAX_ROUNDS = 7
const MASTERY_BONUS = 15

// Animations
const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 }
}

const EtheryonCalculator = () => {
  // États du jeu
  const [gameStarted, setGameStarted] = useState(false)
  const [gameEnded, setGameEnded] = useState(false)
  const [playerCount, setPlayerCount] = useState(3)
  const [playerNames, setPlayerNames] = useState(Array(MAX_PLAYERS).fill(''))
  const [elementScores, setElementScores] = useState([])
  const [currentPlayer, setCurrentPlayer] = useState(0)
  const [currentRound, setCurrentRound] = useState(1)
  const [scores, setScores] = useState([])
  const [masteryBonus, setMasteryBonus] = useState(Array(MAX_ROUNDS).fill(-1))

  // Gestionnaires d'événements optimisés
  const handlePlayerCountChange = useCallback((count) => {
    setPlayerCount(count)
    setPlayerNames(prev => {
      const newNames = [...prev]
      newNames.length = count
      return newNames.fill('', prev.length, count)
    })
  }, [])

  const handlePlayerNameChange = useCallback((index, name) => {
    setPlayerNames(prev => {
      const newNames = [...prev]
      newNames[index] = name
      return newNames
    })
  }, [])

  const startGame = useCallback(() => {
    setElementScores(Array(playerCount).fill().map(() => 
      Array(MAX_ROUNDS).fill().map(() => Array(elements.length).fill(0))
    ))
    setScores(Array(playerCount).fill().map(() => Array(MAX_ROUNDS).fill(0)))
    setMasteryBonus(Array(MAX_ROUNDS).fill(-1))
    setGameStarted(true)
  }, [playerCount])

  const calculateFinalScore = useCallback((elementScores) => {
    if (!elementScores || elementScores.length === 0) return 0
    const maxElement = Math.max(...elementScores)
    return elementScores.reduce((sum, score) => {
      if (score === maxElement) return sum
      return sum - score
    }, maxElement)
  }, [])

  const handleElementScoreChange = useCallback((playerIndex, roundIndex, elementIndex, newScore) => {
    const scoreValue = Math.max(0, parseInt(newScore) || 0)
    
    setElementScores(prev => {
      const newElementScores = [...prev]
      if (!newElementScores[playerIndex]) {
        newElementScores[playerIndex] = Array(MAX_ROUNDS).fill().map(() => Array(elements.length).fill(0))
      }
      newElementScores[playerIndex][roundIndex][elementIndex] = scoreValue
      return newElementScores
    })

    setScores(prev => {
      const newScores = [...prev]
      if (!newScores[playerIndex]) {
        newScores[playerIndex] = Array(MAX_ROUNDS).fill(0)
      }
      const roundScores = elementScores[playerIndex][roundIndex].map((score, idx) => 
        idx === elementIndex ? scoreValue : score
      )
      newScores[playerIndex][roundIndex] = calculateFinalScore(roundScores)
      return newScores
    })
  }, [calculateFinalScore, elementScores])

  const toggleMasteryBonus = useCallback((roundIndex, playerIndex) => {
    setMasteryBonus(prev => {
      const newMasteryBonus = [...prev]
      if (newMasteryBonus[roundIndex] === playerIndex) {
        newMasteryBonus[roundIndex] = -1
      } else {
        if (newMasteryBonus[roundIndex] !== -1) {
          setScores(prevScores => prevScores.map((playerScores, pIndex) => 
            pIndex === newMasteryBonus[roundIndex]
              ? playerScores.map((score, rIndex) => 
                  rIndex === roundIndex ? score - MASTERY_BONUS : score
                )
              : playerScores
          ))
        }
        newMasteryBonus[roundIndex] = playerIndex
      }
      return newMasteryBonus
    })

    setScores(prev => prev.map((playerScores, pIndex) => 
      pIndex === playerIndex
        ? playerScores.map((score, rIndex) => 
            rIndex === roundIndex 
              ? score + (masteryBonus[roundIndex] === playerIndex ? -MASTERY_BONUS : MASTERY_BONUS)
              : score
          )
        : playerScores
    ))
  }, [masteryBonus])

  const calculateTotal = useCallback((playerIndex) => {
    return scores[playerIndex]?.reduce((sum, score) => sum + (score || 0), 0) || 0
  }, [scores])

  const nextTurn = useCallback(() => {
    if (currentPlayer < playerCount - 1) {
      setCurrentPlayer(prev => prev + 1)
    } else {
      setCurrentPlayer(0)
      if (currentRound < MAX_ROUNDS) {
        setCurrentRound(prev => prev + 1)
      } else {
        setGameEnded(true)
      }
    }
  }, [currentPlayer, playerCount, currentRound])

  // Composants de rendu mémorisés
  const ScoreBoard = useMemo(() => (
    <div className="bg-parchment rounded-lg shadow-lg border-2 border-brown-900">
      <div className="bg-brown-900 text-parchment p-4 rounded-t-lg">
        <h2 className="text-xl font-medieval text-center flex items-center justify-center gap-2">
          <Crown className="h-5 w-5" />
          Tableau des Scores
        </h2>
      </div>
      <div className="p-4 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-brown-800">
              <th className="p-2 text-left">Joueur</th>
              {Array.from({ length: MAX_ROUNDS }, (_, i) => (
                <th key={i} className="p-2 text-center">M{i + 1}</th>
              ))}
              <th className="p-2 text-center">Total</th>
            </tr>
          </thead>
          <tbody>
            {playerNames.slice(0, playerCount).map((player, playerIndex) => (
              <tr 
                key={playerIndex}
                className={`
                  border-b border-brown-300
                  ${currentPlayer === playerIndex ? 'bg-brown-100/50' : ''}
                  hover:bg-brown-50/50 transition-colors
                `}
              >
                <td className="p-2 font-semibold">{player || `Joueur ${playerIndex + 1}`}</td>
                {Array.from({ length: MAX_ROUNDS }, (_, roundIndex) => (
                  <td key={roundIndex} className="p-2 text-center">
                    <div className="relative flex flex-col items-center">
                      <span className="font-medieval">
                        {scores[playerIndex]?.[roundIndex] || 0}
                      </span>
                      {masteryBonus[roundIndex] === playerIndex && (
                        <Star className="h-4 w-4 text-yellow-500 absolute -top-2 -right-2" />
                      )}
                    </div>
                  </td>
                ))}
                <td className="p-2 text-center font-bold">
                  {calculateTotal(playerIndex)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ), [playerNames, playerCount, currentPlayer, scores, masteryBonus, calculateTotal])

  const ElementGrid = useMemo(() => (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {elements.map((element, index) => (
        <div 
          key={index}
          className="bg-parchment rounded-lg shadow-md border border-brown-300 overflow-hidden"
        >
          <div className={`${element.bgColor} ${element.textColor} p-2 text-center font-medieval flex items-center justify-center gap-2`}>
            <span className="text-xl">{element.icon}</span>
            <span>{element.name}</span>
          </div>
          <div className="p-4">
            <Input
              type="number"
              min="0"
              value={elementScores[currentPlayer]?.[currentRound - 1]?.[index] || 0}
              onChange={(e) => handleElementScoreChange(
                currentPlayer,
                currentRound - 1,
                index,
                e.target.value
              )}
              className="w-full text-center font-medieval"
            />
          </div>
        </div>
      ))}
    </div>
  ), [elementScores, currentPlayer, currentRound, handleElementScoreChange])

  // Rendu principal
  return (
    <div className="min-h-screen bg-parchment-pattern">
      <header className="bg-brown-900 text-parchment shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-medieval text-center flex items-center justify-center gap-4">
            <Shield className="h-8 w-8" />
            Calculatrice Etheryon
            <Sword className="h-8 w-8" />
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {!gameStarted ? (
            <motion.div
              key="setup"
              {...pageTransition}
              className="flex flex-col md:flex-row gap-8"
            >
              <div className="w-full md:w-2/3 bg-parchment rounded-lg shadow-lg border-2 border-brown-900 p-6">
                <h2 className="text-2xl font-medieval text-center mb-6">Configuration de la Partie</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-lg font-medieval mb-2">Nombre de joueurs :</label>
                    <div className="flex flex-wrap gap-2">
                      {[2, 3, 4, 5, 6, 7, 8].map((count) => (
                        <Button
                          key={count}
                          onClick={() => handlePlayerCountChange(count)}
                          variant={playerCount === count ? "default" : "outline"}
                          className={`
                            ${playerCount === count ? 'bg-brown-900 text-parchment' : 'border-brown-900'}
                            font-medieval
                          `}
                        >
                          {count}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <ScrollArea className="h-64 border rounded-lg p-4">
                    {playerNames.slice(0, playerCount).map((name, index) => (
                      <div key={index} className="mb-4">
                        <Input
                          placeholder={`Nom du joueur ${index + 1}`}
                          value={name}
                          onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                          className="w-full font-medieval"
                        />
                      </div>
                    ))}
                  </ScrollArea>

                  <Button
                    onClick={startGame}
                    disabled={playerNames.slice(0, playerCount).some(name => !name)}
                    className="w-full bg-brown-900 text-parchment hover:bg-brown-800 font-medieval"
                  >
                    Commencer la partie
                  </Button>
                </div>
              </div>

              <div className="w-full md:w-1/3">
                {ScoreBoard}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="game"
              {...pageTransition}
              className="flex flex-col md:flex-row gap-8"
            >
              <div className="w-full md:w-2/3">
                <div className="bg-parchment rounded-lg shadow-lg border-2 border-brown-900 p-6">
                  <h2 className="text-2xl font-medieval text-center mb-6 flex items-center justify-center gap-2">
                    <Heart className="h-6 w-6" />
                    Tour de {playerNames[currentPlayer]} - Manche {currentRound}
                  </h2>

                  {ElementGrid}

                  <div className="mt-6 flex justify-end">
                    <Button
                      onClick={nextTurn}
                      className="bg-brown-900 text-parchment hover:bg-brown-800 font-medieval"
                    >
                      {currentPlayer < playerCount - 1 ? 'Joueur Suivant' : 'Manche Suivante'}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-1/3">
                {ScoreBoard}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

export default EtheryonCalculator
