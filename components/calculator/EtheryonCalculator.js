'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Shield, Sword, Star, Crown, Heart } from 'lucide-react'
import '../styles/theme.css'

const elements = [
  { name: 'Eau', icon: '💧' },
  { name: 'Feu', icon: '🔥' },
  { name: 'Terre', icon: '🌍' },
  { name: 'Air', icon: '🌪️' },
  { name: 'Foudre', icon: '⚡' }
]

const EtheryonCalculator = () => {
  const [gameStarted, setGameStarted] = useState(false)
  const [playerCount, setPlayerCount] = useState(3)
  const [playerNames, setPlayerNames] = useState(Array(8).fill(''))
  const [elementScores, setElementScores] = useState([])
  const [currentPlayer, setCurrentPlayer] = useState(0)
  const [currentRound, setCurrentRound] = useState(1)
  const [scores, setScores] = useState([])
  const [masteryBonus, setMasteryBonus] = useState([])

  // Fonctions de gestion
  const handlePlayerCountChange = (count) => {
    setPlayerCount(count)
    setPlayerNames(prev => {
      const newNames = [...prev]
      newNames.length = count
      return newNames.fill('', prev.length, count)
    })
  }

  const handlePlayerNameChange = (index, name) => {
    setPlayerNames(prev => {
      const newNames = [...prev]
      newNames[index] = name
      return newNames
    })
  }

  const startGame = () => {
    setElementScores(Array(playerCount).fill().map(() => 
      Array(7).fill().map(() => Array(5).fill(0))
    ))
    setScores(Array(playerCount).fill().map(() => Array(7).fill(0)))
    setMasteryBonus(Array(7).fill(-1))
    setGameStarted(true)
  }

  const calculateFinalScore = (elementScores) => {
    if (!elementScores || elementScores.length === 0) return 0
    const maxElement = Math.max(...elementScores)
    return elementScores.reduce((sum, score) => {
      if (score === maxElement) return sum
      return sum - score
    }, maxElement)
  }

  const handleElementScoreChange = (playerIndex, roundIndex, elementIndex, newScore) => {
    const scoreValue = parseInt(newScore) || 0
    
    setElementScores(prev => {
      const newElementScores = [...prev]
      if (!newElementScores[playerIndex]) {
        newElementScores[playerIndex] = Array(7).fill().map(() => Array(5).fill(0))
      }
      if (!newElementScores[playerIndex][roundIndex]) {
        newElementScores[playerIndex][roundIndex] = Array(5).fill(0)
      }
      newElementScores[playerIndex][roundIndex][elementIndex] = scoreValue
      return newElementScores
    })

    setScores(prev => {
      const newScores = [...prev]
      if (!newScores[playerIndex]) {
        newScores[playerIndex] = Array(7).fill(0)
      }
      const roundScores = elementScores[playerIndex][roundIndex].map((score, idx) => 
        idx === elementIndex ? scoreValue : score
      )
      newScores[playerIndex][roundIndex] = calculateFinalScore(roundScores)
      return newScores
    })
  }

  const toggleMasteryBonus = (roundIndex, playerIndex) => {
    setMasteryBonus(prev => {
      const newMasteryBonus = [...prev]
      if (newMasteryBonus[roundIndex] === playerIndex) {
        newMasteryBonus[roundIndex] = -1
      } else {
        if (newMasteryBonus[roundIndex] !== -1) {
          setScores(prevScores => prevScores.map((playerScores, pIndex) => 
            pIndex === newMasteryBonus[roundIndex]
              ? playerScores.map((score, rIndex) => 
                  rIndex === roundIndex ? score - 15 : score
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
              ? score + (masteryBonus[roundIndex] === playerIndex ? -15 : 15)
              : score
          )
        : playerScores
    ))
  }

  const calculateTotal = (playerIndex) => {
    return (scores[playerIndex] || []).reduce((sum, score) => sum + (score || 0), 0)
  }

  // Composant de tableau des scores
  const ScoreBoard = () => (
    <div className="medieval-card">
      <div className="medieval-header">
        <h2 className="text-xl font-semibold flex items-center justify-center gap-2">
          <Crown className="h-5 w-5" />
          Tableau des Scores
        </h2>
      </div>
      <table className="medieval-table w-full">
        <thead>
          <tr>
            <th className="w-32">Héros</th>
            {Array.from({ length: 7 }, (_, i) => (
              <th key={i} className="w-16">M{i + 1}</th>
            ))}
            <th className="w-20">Total</th>
          </tr>
        </thead>
        <tbody>
          {playerNames.slice(0, playerCount).map((player, playerIndex) => (
            <tr key={playerIndex} className={currentPlayer === playerIndex ? 'bg-brown-light/20' : ''}>
              <td className="font-medieval">{player || `Héros ${playerIndex + 1}`}</td>
              {Array.from({ length: 7 }, (_, roundIndex) => (
                <td key={roundIndex} className="text-center">
                  <div className="flex flex-col items-center">
                    {scores[playerIndex]?.[roundIndex] || 0}
                    {masteryBonus[roundIndex] === playerIndex && (
                      <Star className="h-4 w-4 text-yellow-500" />
                    )}
                  </div>
                </td>
              ))}
              <td className="font-bold text-center">{calculateTotal(playerIndex)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  // Composant de saisie des éléments
  const ElementInput = ({ element, icon, value, onChange }) => (
    <div className="medieval-input-group p-2">
      <label className="medieval-label flex items-center gap-2 mb-1">
        <span>{icon}</span>
        <span>{element}</span>
      </label>
      <Input
        type="number"
        value={value}
        onChange={onChange}
        min="0"
        className="medieval-input text-center"
      />
    </div>
  )

  // Rendu principal
  return (
    <div className="medieval-theme min-h-screen">
      <header className="medieval-main-header p-4 text-center">
        <h1 className="text-3xl font-medieval flex items-center justify-center gap-2">
          <Sword className="h-8 w-8" />
          Calculatrice Etheryon
          <Shield className="h-8 w-8" />
        </h1>
      </header>

      <main className="container mx-auto p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Section principale */}
          <div className="w-full lg:w-2/3">
            {!gameStarted ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="medieval-card"
              >
                <div className="medieval-header">
                  <h2 className="text-xl font-medieval">Création des Héros</h2>
                </div>
                <div className="p-4 space-y-4">
                  <div>
                    <label className="medieval-label block mb-2">Nombre de Héros :</label>
                    <div className="flex flex-wrap gap-2">
                      {[2, 3, 4, 5, 6, 7, 8].map((count) => (
                        <button
                          key={count}
                          onClick={() => handlePlayerCountChange(count)}
                          className={`medieval-button ${
                            playerCount === count ? 'medieval-button-active' : ''
                          }`}
                        >
                          {count}
                        </button>
                      ))}
                    </div>
                  </div>

                  <ScrollArea className="h-64 medieval-scroll">
                    {playerNames.slice(0, playerCount).map((name, index) => (
                      <div key={index} className="mb-2">
                        <Input
                          placeholder={`Nom du Héros ${index + 1}`}
                          value={name}
                          onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                          className="medieval-input"
                        />
                      </div>
                    ))}
                  </ScrollArea>

                  <button
                    onClick={startGame}
                    className="medieval-button w-full"
                    disabled={playerNames.slice(0, playerCount).some(name => !name)}
                  >
                    Commencer l'Aventure
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="medieval-card"
              >
                <div className="medieval-header">
                  <h2 className="text-xl font-medieval flex items-center justify-center gap-2">
                    <Heart className="h-5 w-5" />
                    Tour de {playerNames[currentPlayer]} - Manche {currentRound}
                  </h2>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {elements.map((element, index) => (
                      <ElementInput
                        key={index}
                        element={element.name}
                        icon={element.icon}
                        value={elementScores[currentPlayer]?.[currentRound - 1]?.[index] || 0}
                        onChange={(e) => handleElementScoreChange(
                          currentPlayer,
                          currentRound - 1,
                          index,
                          e.target.value
                        )}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      if (currentPlayer < playerCount - 1) {
                        setCurrentPlayer(currentPlayer + 1)
                      } else {
                        setCurrentPlayer(0)
                        setCurrentRound(currentRound < 7 ? currentRound + 1 : currentRound)
                      }
                    }}
                    className="medieval-button mt-4"
                  >
                    {currentPlayer < playerCount - 1 ? 'Héros Suivant' : 'Manche Suivante'}
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Tableau des scores */}
          <div className="w-full lg:w-1/3">
            <ScoreBoard />
          </div>
        </div>
      </main>
    </div>
  )
}

export default EtheryonCalculator
