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
import { SunIcon, MoonIcon, Trophy, Users, UserPlus2 } from 'lucide-react'

const elements = ['Eau', 'Feu', 'Terre', 'Air', 'Foudre']

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 }
}

const ElementInput = ({ element, value, onChange, className }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
      {element}
    </label>
    <Input
      type="number"
      value={value}
      onChange={onChange}
      className={`input-element ${className}`}
      min="0"
    />
  </div>
)

const EtheryonCalculator = () => {
  const { theme, setTheme } = useTheme()
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

  const renderElementInputs = (playerIndex, roundIndex) => (
    <motion.div 
      className="grid grid-cols-2 md:grid-cols-5 gap-4"
      variants={fadeIn}
      initial="initial"
      animate="animate"
    >
      {elements.map((element, elementIndex) => (
        <ElementInput
          key={elementIndex}
          element={element}
          value={elementScores[playerIndex]?.[roundIndex]?.[elementIndex] || 0}
          onChange={(e) => handleElementScoreChange(playerIndex, roundIndex, elementIndex, e.target.value)}
          className="w-full text-center"
        />
      ))}
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <motion.div 
          className="flex justify-between items-center mb-8"
          variants={fadeIn}
          initial="initial"
          animate="animate"
        >
          <div className="flex items-center space-x-4">
            <a 
              href="https://www.etheryon.fr" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 transition-colors flex items-center space-x-2"
            >
              <Trophy className="h-5 w-5" />
              <span>Site officiel Etheryon</span>
            </a>
          </div>
          <div className="flex items-center space-x-4">
            <SunIcon className="h-5 w-5" />
            <Switch 
              checked={theme === 'dark'}
              onCheckedChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="data-[state=checked]:bg-primary"
            />
            <MoonIcon className="h-5 w-5" />
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {!gameStarted ? (
            <motion.div
              key="setup"
              className="card-container max-w-md mx-auto p-6"
              variants={fadeIn}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold flex items-center space-x-2">
                    <Users className="h-6 w-6" />
                    <span>Configuration du jeu</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="block mb-2 font-medium">Nombre de joueurs :</label>
                    <div className="flex flex-wrap gap-2">
                      {[2, 3, 4, 5, 6, 7, 8].map((count) => (
                        <Button
                          key={count}
                          onClick={() => handlePlayerCountChange(count)}
                          variant={playerCount === count ? "default" : "outline"}
                          className={playerCount === count ? 'button-primary' : 'button-secondary'}
                        >
                          {count}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={teamMode}
                      onCheckedChange={(checked) => setTeamMode(checked)}
                      className="data-[state=checked]:bg-primary"
                    />
                    <label className="font-medium flex items-center space-x-2">
                      <UserPlus2 className="h-5 w-5" />
                      <span>Mode équipe</span>
                    </label>
                  </div>

                  <ScrollArea className="h-60 rounded-md border p-4">
                    <div className="space-y-4">
                      {playerNames.slice(0, playerCount).map((name, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input
                            placeholder={`Joueur ${index + 1}`}
                            value={name}
                            onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                            className="input-element"
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
                                    className={`team-${teamNumber}`}
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
                    className="w-full button-primary"
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
              className="card-container max-w-4xl mx-auto p-6"
              variants={fadeIn}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <Card>
  <CardHeader>
    <CardTitle className="text-2xl font-bold flex items-center space-x-2">
      <Trophy className="h-6 w-6" />
      <span>Résultats finaux</span>
    </CardTitle>
  </CardHeader>
  <CardContent>
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-800">
            <th className="table-header">Joueur</th>
            {[1, 2, 3, 4, 5, 6, 7].map(round => (
              <th key={round} className="table-header">Manche {round}</th>
            ))}
            <th className="table-header">Total</th>
          </tr>
        </thead>
        <tbody>
          {playerNames.slice(0, playerCount).map((player, playerIndex) => (
            <tr 
              key={playerIndex} 
              className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors
                ${player === getWinner() ? "bg-green-100 dark:bg-green-800" : ""}
                ${teamMode ? `team-${teams[playerIndex]}` : ''}`}
            >
              <td className="table-cell font-medium">
                {player} {teamMode && `(Équipe ${teams[playerIndex]})`}
              </td>
              {(scores[playerIndex] || []).map((score, roundIndex) => (
                <td key={roundIndex} className="table-cell text-center">
                  {editMode ? (
                    <div className="p-2">
                      {renderElementInputs(playerIndex, roundIndex)}
                    </div>
                  ) : (
                    <>
                      {score || 0}
                      {masteryBonus[roundIndex] === playerIndex && 
                        <span className="ml-1 text-primary">(M)</span>
                      }
                    </>
                  )}
                </td>
              ))}
              <td className="table-cell text-center font-bold">
                {calculateTotal(playerIndex)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <div className="mt-8 text-center space-y-6">
      <div className="text-2xl font-bold">
        {teamMode ? "Équipe gagnante" : "Gagnant"} : {getWinner()}
      </div>
      
      <div className="flex justify-center gap-4">
        <Button 
          onClick={() => setEditMode(!editMode)}
          variant="outline"
          className="button-secondary"
        >
          {editMode ? "Terminer l'édition" : "Modifier les scores"}
        </Button>
        
        <Button 
          onClick={() => {
            setGameStarted(false)
            setGameEnded(false)
            setCurrentPlayer(0)
            setCurrentRound(1)
            setScores([])
            setElementScores([])
            setMasteryBonus(Array(7).fill(-1))
            setEditMode(false)
          }}
          className="button-primary"
        >
          Nouvelle partie
        </Button>
      </div>
    </div>
  </CardContent>
</Card>
            </motion.div>
          ) : (
            <motion.div
              key="game"
              variants={fadeIn}
              initial="initial"
              animate="animate"
              exit="exit"
              className="card-container max-w-4xl mx-auto"
            >
              <Card>
  <CardHeader>
    <CardTitle className="text-2xl font-bold flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <span>Tour de {playerNames[currentPlayer]}</span>
        <span className="text-gray-500 dark:text-gray-400">
          - Manche {currentRound}
        </span>
      </div>
      {teamMode && (
        <span className={`px-3 py-1 rounded-full text-sm team-${teams[currentPlayer]}`}>
          Équipe {teams[currentPlayer]}
        </span>
      )}
    </CardTitle>
  </CardHeader>
  <CardContent className="space-y-6">
    {/* Section des éléments */}
    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Points des éléments</h3>
      {renderElementInputs(currentPlayer, currentRound - 1)}
    </div>

    {/* Table des scores */}
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="table-header">Joueur</th>
            {[1, 2, 3, 4, 5, 6, 7].map(round => (
              <th key={round} className="table-header">
                Manche {round}
              </th>
            ))}
            <th className="table-header">Total</th>
          </tr>
        </thead>
        <tbody>
          {playerNames.slice(0, playerCount).map((player, playerIndex) => (
            <motion.tr 
              key={playerIndex}
              className={`
                hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors
                ${currentPlayer === playerIndex ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
                ${teamMode ? `team-${teams[playerIndex]}` : ''}
              `}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: playerIndex * 0.1 }}
            >
              <td className="table-cell font-medium">
                {player} {teamMode && `(Équipe ${teams[playerIndex]})`}
              </td>
              {(scores[playerIndex] || []).map((score, roundIndex) => (
                <td key={roundIndex} className="table-cell text-center">
                  {score || 0}
                  {masteryBonus[roundIndex] === playerIndex && (
                    <span className="ml-1 text-primary">(M)</span>
                  )}
                </td>
              ))}
              <td className="table-cell text-center font-bold">
                {calculateTotal(playerIndex)}
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Section Maîtrise */}
    <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Maîtrise par manche</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="table-header">Manche</th>
              {playerNames.slice(0, playerCount).map((player, index) => (
                <th key={index} className="table-header">{player}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {masteryBonus.map((masteryPlayerIndex, roundIndex) => (
              <tr key={roundIndex}>
                <td className="table-cell text-center">{roundIndex + 1}</td>
                {playerNames.slice(0, playerCount).map((_, playerIndex) => (
                  <td key={playerIndex} className="table-cell text-center">
                    <Checkbox
                      checked={masteryPlayerIndex === playerIndex}
                      onCheckedChange={() => toggleMasteryBonus(roundIndex, playerIndex)}
                      className="data-[state=checked]:bg-primary"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    {/* Boutons d'action */}
    <div className="flex justify-between mt-6">
      <Button 
        variant="outline"
        onClick={() => setEditMode(!editMode)}
        className="button-secondary"
      >
        {editMode ? "Terminer l'édition" : "Modifier les scores"}
      </Button>
      <Button 
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
        className="button-primary"
      >
        {currentRound === 7 && currentPlayer === playerCount - 1 
          ? "Terminer la partie" 
          : "Joueur suivant"
        }
      </Button>
    </div>
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
