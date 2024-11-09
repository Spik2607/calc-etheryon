'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Trophy, Users, SunIcon, MoonIcon } from 'lucide-react'

// Constants
const elements = ['Eau', 'Feu', 'Terre', 'Air', 'Foudre']

// Animations
const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 }
}

const ElementInput = ({ element, value, onChange, className }) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {element}
      </label>
      <Input
        type="number"
        value={value}
        onChange={onChange}
        className={`w-full text-center ${className}`}
        min="0"
      />
    </div>
  )
}

const EtheryonCalculator = () => {
  // Theme State
  const { theme, setTheme } = useTheme()

  // Game States
  const [gameStarted, setGameStarted] = useState(false)
  const [gameEnded, setGameEnded] = useState(false)
  const [playerCount, setPlayerCount] = useState(3)
  const [playerNames, setPlayerNames] = useState(Array(8).fill(''))
  const [elementScores, setElementScores] = useState([])
  const [currentPlayer, setCurrentPlayer] = useState(0)
  const [currentRound, setCurrentRound] = useState(1)
  const [scores, setScores] = useState([])
  const [masteryBonus, setMasteryBonus] = useState([])
  const [editMode, setEditMode] = useState(false)
  const [teamMode, setTeamMode] = useState(false)
  const [teams, setTeams] = useState([])

  // Handlers
  const handlePlayerCountChange = (count) => {
    setPlayerCount(count)
    setPlayerNames(prev => {
      const newNames = [...prev]
      newNames.length = count
      return newNames.fill('', prev.length, count)
    })
    setTeams(Array(count).fill(0))
  }

  const handlePlayerNameChange = (index, name) => {
    setPlayerNames(prev => {
      const newNames = [...prev]
      newNames[index] = name
      return newNames
    })
  }

  const handleTeamChange = (index, teamNumber) => {
    setTeams(prev => {
      const newTeams = [...prev]
      newTeams[index] = teamNumber
      return newTeams
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

  const getWinner = () => {
    if (teamMode) {
      const teamScores = teams.reduce((acc, team, index) => {
        if (!acc[team]) acc[team] = 0
        acc[team] += calculateTotal(index)
        return acc
      }, {})
      const maxScore = Math.max(...Object.values(teamScores))
      const winningTeams = Object.entries(teamScores)
        .filter(([_, score]) => score === maxScore)
        .map(([team]) => `Équipe ${team}`)
      return winningTeams.join(' et ')
    } else {
      const totals = playerNames.slice(0, playerCount).map((_, index) => calculateTotal(index))
      const maxScore = Math.max(...totals)
      const winners = playerNames.filter((_, index) => calculateTotal(index) === maxScore)
      return winners.join(' et ')
    }
  }
  // Render Functions
  const renderElementInputs = (playerIndex, roundIndex) => (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {elements.map((element, elementIndex) => (
        <ElementInput
          key={elementIndex}
          element={element}
          value={elementScores[playerIndex]?.[roundIndex]?.[elementIndex] || 0}
          onChange={(e) => handleElementScoreChange(playerIndex, roundIndex, elementIndex, e.target.value)}
          className="w-full text-center"
        />
      ))}
    </div>
  )

  // Main Render
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4">
        {/* Header avec logo et switch de thème */}
        <div className="flex justify-between items-center mb-6">
          <a 
            href="https://www.etheryon.fr" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/80 transition-colors flex items-center space-x-2"
          >
            <Trophy className="h-5 w-5" />
            <span className="font-medium">Site officiel Etheryon</span>
          </a>
          <div className="flex items-center space-x-2">
            <SunIcon className="h-5 w-5" />
            <Switch 
              checked={theme === 'dark'}
              onCheckedChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            />
            <MoonIcon className="h-5 w-5" />
          </div>
        </div>

        {/* Contenu principal avec animation */}
        <AnimatePresence mode="wait">
          {!gameStarted ? (
            <motion.div
              key="setup"
              {...fadeIn}
            >
              <Card className="max-w-md mx-auto">
                <CardHeader>
                  <CardTitle>Configuration de la partie</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Nombre de joueurs */}
                  <div className="mb-6">
                    <label className="block mb-2 font-medium">Nombre de joueurs :</label>
                    <div className="flex flex-wrap gap-2">
                      {[2, 3, 4, 5, 6, 7, 8].map((count) => (
                        <Button
                          key={count}
                          onClick={() => handlePlayerCountChange(count)}
                          variant={playerCount === count ? "default" : "outline"}
                        >
                          {count}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Mode équipe */}
                  <div className="mb-6">
                    <label className="flex items-center space-x-2">
                      <Checkbox
                        checked={teamMode}
                        onCheckedChange={(checked) => setTeamMode(checked)}
                      />
                      <span>Mode équipe</span>
                    </label>
                  </div>

                  {/* Liste des joueurs */}
                  <ScrollArea className="h-60">
                    <div className="space-y-4">
                      {playerNames.slice(0, playerCount).map((name, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input
                            placeholder={`Joueur ${index + 1}`}
                            value={name}
                            onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                          />
                          {teamMode && (
                            <Select
                              value={teams[index].toString()}
                              onValueChange={(value) => handleTeamChange(index, parseInt(value))}
                            >
                              <SelectTrigger className="w-24">
                                <SelectValue placeholder="Équipe" />
                              </SelectTrigger>
                              <SelectContent>
                                {[1, 2, 3, 4].map((teamNumber) => (
                                  <SelectItem 
                                    key={teamNumber} 
                                    value={teamNumber.toString()}
                                  >
                                    Équipe {teamNumber}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  <Button 
                    onClick={startGame} 
                    className="w-full mt-6"
                    disabled={playerNames.slice(0, playerCount).some(name => !name)}
                  >
                    Commencer la partie
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ) : gameEnded ? (
            <motion.div
              key="results"
              {...fadeIn}
            >
              <Card className="max-w-4xl mx-auto">
                <CardHeader>
                  <CardTitle>Résultats Finaux</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr>
                          <th className="px-4 py-2 text-left">Joueur</th>
                          {Array.from({length: 7}, (_, i) => (
                            <th key={i} className="px-4 py-2 text-center">M{i + 1}</th>
                          ))}
                          <th className="px-4 py-2 text-center">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {playerNames.slice(0, playerCount).map((player, index) => (
                          <tr key={index} className={player === getWinner() ? "bg-green-100 dark:bg-green-900" : ""}>
                            <td className="px-4 py-2">{player}</td>
                            {(scores[index] || []).map((score, i) => (
                              <td key={i} className="px-4 py-2 text-center">
                                {score || 0}
                              </td>
                            ))}
                            <td className="px-4 py-2 text-center font-bold">
                              {calculateTotal(index)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-6 text-center">
                    <div className="text-2xl font-bold mb-4">
                      {teamMode ? "Équipe gagnante" : "Gagnant"} : {getWinner()}
                    </div>
                    <Button onClick={() => {
                      setGameStarted(false)
                      setGameEnded(false)
                      setCurrentPlayer(0)
                      setCurrentRound(1)
                    }}>
                      Nouvelle partie
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="game"
              {...fadeIn}
            >
              <Card className="max-w-4xl mx-auto">
                <CardHeader>
                  <CardTitle>
                    Tour de {playerNames[currentPlayer]} - Manche {currentRound}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {renderElementInputs(currentPlayer, currentRound - 1)}
                  <Button 
                    className="mt-6"
                    onClick={() => {
                      if (currentPlayer < playerCount - 1) {
                        setCurrentPlayer(currentPlayer + 1)
                      } else {
                        setCurrentPlayer(0)
                        if (currentRound < 7) {
                          setCurrentRound(currentRound + 1)
                        } else {
                          setGameEnded(true)
                        }
                      }
                    }}
                  >
                    {currentRound === 7 && currentPlayer === playerCount - 1 
                      ? "Terminer la partie" 
                      : "Joueur suivant"
                    }
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default EtheryonCalculator
