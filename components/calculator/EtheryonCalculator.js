'use client'

import React, { useState, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { Shield, Sword, Star, Crown, Heart, ChevronRight, Award } from "lucide-react"

const elements = [
  { name: 'Eau', icon: '💧', color: 'text-blue-500' },
  { name: 'Feu', icon: '🔥', color: 'text-red-500' },
  { name: 'Terre', icon: '🌍', color: 'text-green-500' },
  { name: 'Air', icon: '🌪️', color: 'text-gray-500' },
  { name: 'Foudre', icon: '⚡', color: 'text-yellow-500' }
]

const MAX_PLAYERS = 8
const MAX_ROUNDS = 7
const MASTERY_BONUS = 15

const initialGameState = {
  started: false,
  ended: false,
  playerCount: 3,
  currentPlayer: 0,
  currentRound: 1,
  playerNames: Array(MAX_PLAYERS).fill(''),
  elementScores: [],
  scores: [],
  masteryBonus: Array(MAX_ROUNDS).fill(-1)
}

const EtheryonCalculator = () => {
  // État global du jeu
  const [gameState, setGameState] = useState({ ...initialGameState })
  
  // Déstructuration pour plus de clarté
  const {
    started: gameStarted,
    ended: gameEnded,
    playerCount,
    currentPlayer,
    currentRound,
    playerNames,
    elementScores,
    scores,
    masteryBonus
  } = gameState

  // Gestionnaires d'événements optimisés
  const handlePlayerCountChange = useCallback((count) => {
    setGameState(prev => ({
      ...prev,
      playerCount: count,
      playerNames: prev.playerNames.map((name, i) => i < count ? name : '')
    }))
  }, [])

  const handlePlayerNameChange = useCallback((index, name) => {
    setGameState(prev => ({
      ...prev,
      playerNames: prev.playerNames.map((n, i) => i === index ? name : n)
    }))
  }, [])

  const calculateFinalScore = useCallback((elementScores) => {
    if (!elementScores?.length) return 0
    const maxElement = Math.max(...elementScores)
    return elementScores.reduce((sum, score) => 
      score === maxElement ? sum : sum - score, maxElement)
  }, [])

  const startGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      started: true,
      elementScores: Array(prev.playerCount).fill()
        .map(() => Array(MAX_ROUNDS).fill()
        .map(() => Array(elements.length).fill(0))),
      scores: Array(prev.playerCount).fill()
        .map(() => Array(MAX_ROUNDS).fill(0))
    }))
  }, [])

  const handleElementScoreChange = useCallback((playerIndex, roundIndex, elementIndex, value) => {
    const scoreValue = Math.max(0, parseInt(value) || 0)
    
    setGameState(prev => {
      const newElementScores = [...prev.elementScores]
      if (!newElementScores[playerIndex]) {
        newElementScores[playerIndex] = Array(MAX_ROUNDS).fill()
          .map(() => Array(elements.length).fill(0))
      }
      newElementScores[playerIndex][roundIndex][elementIndex] = scoreValue

      const newScores = [...prev.scores]
      newScores[playerIndex] = newScores[playerIndex] || Array(MAX_ROUNDS).fill(0)
      newScores[playerIndex][roundIndex] = calculateFinalScore(
        newElementScores[playerIndex][roundIndex]
      )

      return {
        ...prev,
        elementScores: newElementScores,
        scores: newScores
      }
    })
  }, [calculateFinalScore])

  const toggleMasteryBonus = useCallback((roundIndex, playerIndex) => {
    setGameState(prev => {
      const newMasteryBonus = [...prev.masteryBonus]
      const oldBonusPlayer = newMasteryBonus[roundIndex]
      newMasteryBonus[roundIndex] = oldBonusPlayer === playerIndex ? -1 : playerIndex

      const newScores = prev.scores.map((playerScores, pIndex) => 
        playerScores.map((score, rIndex) => {
          if (rIndex !== roundIndex) return score
          if (pIndex === oldBonusPlayer) return score - MASTERY_BONUS
          if (pIndex === playerIndex && oldBonusPlayer !== playerIndex) {
            return score + MASTERY_BONUS
          }
          return score
        })
      )

      return {
        ...prev,
        masteryBonus: newMasteryBonus,
        scores: newScores
      }
    })
  }, [])

  const calculateTotal = useCallback((playerIndex) => {
    return scores[playerIndex]?.reduce((sum, score) => sum + (score || 0), 0) || 0
  }, [scores])

  const nextTurn = useCallback(() => {
    setGameState(prev => {
      const nextPlayer = (prev.currentPlayer + 1) % prev.playerCount
      const nextRound = nextPlayer === 0 ? prev.currentRound + 1 : prev.currentRound
      
      return {
        ...prev,
        currentPlayer: nextPlayer,
        currentRound: nextRound,
        ended: nextRound > MAX_ROUNDS
      }
    })
  }, [])

  const resetGame = useCallback(() => {
    setGameState({ ...initialGameState })
  }, [])

  // Composants de rendu mémorisés
  const ScoreBoard = useMemo(() => (
    <Card className="medieval-card border-2 border-amber-900">
      <CardHeader className="bg-amber-900 text-amber-50">
        <CardTitle className="flex items-center justify-center gap-2">
          <Crown className="h-5 w-5" />
          Tableau des Scores
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-amber-800 text-amber-50">
                <th className="border border-amber-900 p-2">Héros</th>
                {Array.from({ length: MAX_ROUNDS }, (_, i) => (
                  <th key={i} className="border border-amber-900 p-2">M{i + 1}</th>
                ))}
                <th className="border border-amber-900 p-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {playerNames.slice(0, playerCount).map((player, playerIndex) => (
                <tr 
                  key={playerIndex}
                  className={`
                    ${currentPlayer === playerIndex ? 'bg-amber-50' : 'bg-amber-100/50'}
                    hover:bg-amber-200/50 transition-colors
                  `}
                >
                  <td className="border border-amber-900 p-2 font-semibold">
                    {player || `Héros ${playerIndex + 1}`}
                  </td>
                  {Array.from({ length: MAX_ROUNDS }, (_, roundIndex) => (
                    <td key={roundIndex} className="border border-amber-900 p-2 text-center">
                      <div className="flex flex-col items-center">
                        {scores[playerIndex]?.[roundIndex] || 0}
                        {masteryBonus[roundIndex] === playerIndex && (
                          <Star className="h-4 w-4 text-amber-500 mt-1" />
                        )}
                      </div>
                    </td>
                  ))}
                  <td className="border border-amber-900 p-2 text-center font-bold">
                    {calculateTotal(playerIndex)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  ), [playerNames, playerCount, currentPlayer, scores, masteryBonus, calculateTotal])

  const ElementInputs = useMemo(() => (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {elements.map((element, index) => (
        <div key={index} className="medieval-input-group">
          <label className="block text-sm font-medium mb-1 flex items-center gap-2">
            <span className={element.color}>{element.icon}</span>
            <span>{element.name}</span>
          </label>
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
            className="medieval-input text-center"
          />
        </div>
      ))}
    </div>
  ), [elementScores, currentPlayer, currentRound, handleElementScoreChange])

  // Rendu principal
  return (
    <div className="min-h-screen bg-amber-50">
      <header className="bg-amber-900 text-amber-50 p-4 shadow-lg">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-medieval flex items-center gap-2">
            <Sword className="h-6 w-6 md:h-8 md:w-8" />
            Calculatrice Etheryon
            <Shield className="h-6 w-6 md:h-8 md:w-8" />
          </h1>
        </div>
      </header>

      <main className="container mx-auto p-4">
        <AnimatePresence mode="wait">
          {!gameStarted ? (
            <motion.div
              key="setup"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col md:flex-row gap-4"
            >
              <Card className="w-full md:w-2/3 medieval-card border-2 border-amber-900">
                <CardHeader className="bg-amber-900 text-amber-50">
                  <CardTitle className="flex items-center justify-center gap-2">
                    <Award className="h-5 w-5" />
                    Création des Héros
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 p-4">
                  <div>
                    <label className="block text-lg font-medium mb-2">
                      Nombre de Héros :
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[2, 3, 4, 5, 6, 7, 8].map((count) => (
                        <Button
                          key={count}
                          onClick={() => handlePlayerCountChange(count)}
                          variant={playerCount === count ? "default" : "outline"}
                          className={`
                            ${playerCount === count 
                              ? 'bg-amber-900 text-amber-50' 
                              : 'border-amber-900 text-amber-900'
                            }
                          `}
                        >
                          {count}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <ScrollArea className="h-64 border rounded-lg p-4">
                    <div className="space-y-4">
                      {playerNames.slice(0, playerCount).map((name, index) => (
                        <Input
                          key={index}
                          placeholder={`Nom du Héros ${index + 1}`}
                          value={name}
                          onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                          className="medieval-input"
                        />
                      ))}
                    </div>
                  </ScrollArea>

                  <Button
                    onClick={startGame}
                    disabled={playerNames.slice(0, playerCount).some(name => !name)}
                    className="w-full bg-amber-900 text-amber-50 hover:bg-amber-800"
                  >
                    Commencer l'Aventure
                  </Button>
                </CardContent>
              </Card>

              <div className="w-full md:w-1/3">
                {ScoreBoard}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="game"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col md:flex-row gap-4"
            >
              <Card className="w-full md:w-2/3 medieval-card border-2 border-amber-900">
                <CardHeader className="bg-amber-900 text-amber-50">
                  <CardTitle className="flex items-center justify-center gap-2">
                    <Heart className="h-5 w-5" />
                    {`Tour de ${playerNames[currentPlayer]} - Manche ${currentRound}`}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 p-4">
                  {ElementInputs}
                  
                  <div className="flex justify-end">
                    <Button
                      onClick={nextTurn}
                      className="bg-amber-900 text-amber-50 hover:bg-amber-800"
                    >
                      {currentPlayer < playerCount - 1 ? (
                        <span className="flex items-center gap-2">
                          Héros Suivant
                          <ChevronRight className="h-4 w-4" />
                        </span>
                      ) : currentRound < MAX_ROUNDS ? (
                        'Manche Suivante'
                      ) : (
                        'Terminer la Partie'
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

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
