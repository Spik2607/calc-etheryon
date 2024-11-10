'use client'

import React, { useState, useCallback, useMemo } from 'react'
import { Shield, Sword, Crown, Star, Users } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

// Constants
const elements = [
  { name: 'Eau', icon: '💧', color: 'text-blue-500', label: '⚈' },
  { name: 'Feu', icon: '🔥', color: 'text-red-500', label: '🔥' },
  { name: 'Terre', icon: '🌍', color: 'text-green-500', label: '◉' },
  { name: 'Air', icon: '🌪️', color: 'text-gray-500', label: '☁' },
  { name: 'Foudre', icon: '⚡', color: 'text-yellow-500', label: '⚡' }
]

const MAX_PLAYERS = 8
const MAX_ROUNDS = 7
const MASTERY_BONUS = 15
const MAX_TEAMS = 4

const EtheryonCalculator = () => {
  // États de base
  const [gameStarted, setGameStarted] = useState(false)
  const [gameEnded, setGameEnded] = useState(false)
  const [playerCount, setPlayerCount] = useState(3)
  const [playerNames, setPlayerNames] = useState(Array(MAX_PLAYERS).fill(''))
  const [currentPlayer, setCurrentPlayer] = useState(0)
  const [currentRound, setCurrentRound] = useState(1)
  const [scores, setScores] = useState([])
  const [elementScores, setElementScores] = useState([])
  
  // États pour le mode équipe
  const [teamMode, setTeamMode] = useState(false)
  const [teams, setTeams] = useState(Array(MAX_PLAYERS).fill(0))
  
  // États pour la maîtrise
  const [masteryBonus, setMasteryBonus] = useState(Array(MAX_ROUNDS).fill(-1))

  // Gestion des joueurs et équipes
  const handlePlayerCountChange = useCallback((count) => {
    setPlayerCount(count)
    setPlayerNames(prev => {
      const newNames = [...prev]
      newNames.length = count
      return newNames.fill('', prev.length, count)
    })
    setTeams(Array(count).fill(0))
  }, [])

  const handlePlayerNameChange = useCallback((index, name) => {
    setPlayerNames(prev => {
      const newNames = [...prev]
      newNames[index] = name
      return newNames
    })
  }, [])

  const handleTeamChange = useCallback((index, teamNumber) => {
    setTeams(prev => {
      const newTeams = [...prev]
      newTeams[index] = teamNumber
      return newTeams
    })
  }, [])

  // Gestion du jeu
  const startGame = useCallback(() => {
    setElementScores(Array(playerCount).fill().map(() => 
      Array(MAX_ROUNDS).fill().map(() => Array(elements.length).fill(0))
    ))
    setScores(Array(playerCount).fill().map(() => Array(MAX_ROUNDS).fill(0)))
    setMasteryBonus(Array(MAX_ROUNDS).fill(-1))
    setGameStarted(true)
    setGameEnded(false)
    setCurrentPlayer(0)
    setCurrentRound(1)
  }, [playerCount])

  const resetGame = useCallback(() => {
    setGameStarted(false)
    setGameEnded(false)
    setCurrentPlayer(0)
    setCurrentRound(1)
    setScores([])
    setElementScores([])
    setMasteryBonus(Array(MAX_ROUNDS).fill(-1))
    setPlayerNames(Array(MAX_PLAYERS).fill(''))
    setTeams(Array(MAX_PLAYERS).fill(0))
    setTeamMode(false)
    setPlayerCount(3)
  }, [])

  const isGameOver = useCallback(() => {
    return currentRound === MAX_ROUNDS && currentPlayer === playerCount - 1
  }, [currentRound, currentPlayer, playerCount])

  // Calculs des scores
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
    if (masteryBonus[roundIndex] === playerIndex) {
      // Retirer le bonus
      setMasteryBonus(prev => {
        const newBonus = [...prev]
        newBonus[roundIndex] = -1
        return newBonus
      })
      
      setScores(prev => prev.map((playerScores, pIndex) => 
        pIndex === playerIndex
          ? playerScores.map((score, rIndex) => 
              rIndex === roundIndex ? score - MASTERY_BONUS : score
            )
          : playerScores
      ))
    } else {
      // Ajouter le bonus au nouveau joueur et le retirer de l'ancien si nécessaire
      setMasteryBonus(prev => {
        const newBonus = [...prev]
        const oldBonusPlayer = newBonus[roundIndex]
        
        if (oldBonusPlayer !== -1) {
          setScores(prevScores => prevScores.map((playerScores, pIndex) => 
            pIndex === oldBonusPlayer
              ? playerScores.map((score, rIndex) => 
                  rIndex === roundIndex ? score - MASTERY_BONUS : score
                )
              : playerScores
          ))
        }
        
        newBonus[roundIndex] = playerIndex
        return newBonus
      })
      
      setScores(prev => prev.map((playerScores, pIndex) => 
        pIndex === playerIndex
          ? playerScores.map((score, rIndex) => 
              rIndex === roundIndex ? score + MASTERY_BONUS : score
            )
          : playerScores
      ))
    }
  }, [])

  // Calculs des totaux et gestion du gagnant
  const calculateTotal = useCallback((playerIndex) => {
    return (scores[playerIndex] || []).reduce((sum, score) => sum + (score || 0), 0)
  }, [scores])

  const calculateTeamTotal = useCallback((teamNumber) => {
    return playerNames.reduce((sum, _, playerIndex) => {
      if (teams[playerIndex] === teamNumber) {
        return sum + calculateTotal(playerIndex)
      }
      return sum
    }, 0)
  }, [teams, calculateTotal, playerNames])

  const getWinner = useCallback(() => {
    if (teamMode) {
      const teamScores = {}
      for (let i = 1; i <= MAX_TEAMS; i++) {
        teamScores[i] = calculateTeamTotal(i)
      }
      const maxScore = Math.max(...Object.values(teamScores))
      const winningTeams = Object.entries(teamScores)
        .filter(([_, score]) => score === maxScore)
        .map(([team]) => `Équipe ${team}`)
      return winningTeams.join(' et ')
    } else {
      const totals = playerNames.slice(0, playerCount).map((_, index) => calculateTotal(index))
      const maxScore = Math.max(...totals)
      const winners = playerNames
        .filter((_, index) => calculateTotal(index) === maxScore)
      return winners.join(' et ')
    }
  }, [teamMode, calculateTeamTotal, playerNames, playerCount, calculateTotal])

  const handleNextTurn = useCallback(() => {
    if (isGameOver()) {
      setGameEnded(true)
      return
    }

    if (currentPlayer < playerCount - 1) {
      setCurrentPlayer(prev => prev + 1)
    } else {
      setCurrentPlayer(0)
      if (currentRound < MAX_ROUNDS) {
        setCurrentRound(prev => prev + 1)
      }
    }
  }, [currentPlayer, playerCount, currentRound, isGameOver])

  // Rendu des composants
  const renderSetupScreen = () => (
    <div className="calculator-container">
      <div className="game-section">
        <h2 className="medieval-title flex items-center justify-center gap-2 mb-6">
          <Users className="h-6 w-6" />
          Configuration de la partie
        </h2>
        
        <div className="space-y-6">
          <div>
            <label className="medieval-label block mb-2">Nombre de joueurs :</label>
            <div className="flex flex-wrap gap-2">
              {[2, 3, 4, 5, 6, 7, 8].map((count) => (
                <button
                  key={count}
                  onClick={() => handlePlayerCountChange(count)}
                  className={`medieval-button ${playerCount === count ? 'medieval-button-active' : ''}`}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <input
              type="checkbox"
              checked={teamMode}
              onChange={(e) => setTeamMode(e.target.checked)}
              className="medieval-checkbox"
              id="teamMode"
            />
            <label htmlFor="teamMode" className="medieval-label">Mode équipe</label>
          </div>

          <ScrollArea className="h-64 medieval-scroll">
            {playerNames.slice(0, playerCount).map((name, index) => (
              <div key={index} className="mb-4">
                <div className="flex gap-2">
                  <Input
                    placeholder={`Nom du joueur ${index + 1}`}
                    value={name}
                    onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                    className="medieval-input"
                  />
                  {teamMode && (
                    <select
                      value={teams[index]}
                      onChange={(e) => handleTeamChange(index, parseInt(e.target.value))}
                      className="medieval-select"
                    >
                      {Array.from({length: MAX_TEAMS}, (_, i) => i + 1).map(num => (
                        <option key={num} value={num}>Équipe {num}</option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
            ))}
          </ScrollArea>

          <button
            onClick={startGame}
            disabled={playerNames.slice(0, playerCount).some(name => !name)}
            className="medieval-button w-full"
          >
            Commencer la partie
          </button>
        </div>
      </div>
    </div>
  )

  const renderGameScreen = () => (
    <div className="calculator-container">
      <div className="game-section">
        <h2 className="medieval-title flex items-center justify-center gap-2 mb-6">
          <Crown className="h-6 w-6" />
          {gameEnded ? "Résultats finaux" : `Tour de ${playerNames[currentPlayer]} - Manche ${currentRound}`}
        </h2>

        {!gameEnded && (
          <div className="elements-grid">
            {elements.map((element, index) => (
              <div key={index} className="element-input">
                <span className={`element-icon ${element.color}`}>{element.label}</span>
                <span className="element-name">{element.name}</span>
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
                  className="medieval-input"
                />
              </div>
            ))}
          </div>
        )}

        <table className="scores-table mt-6">
          <thead>
            <tr>
              <th>Joueur</th>
              {Array.from({length: MAX_ROUNDS}, (_, i) => (
                <th key={i}>M{i + 1}</th>
              ))}
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {playerNames.slice(0, playerCount).map((player, playerIndex) => (
              <tr key={playerIndex} className={currentPlayer === playerIndex && !gameEnded ? 'current-player' : ''}>
                <td className="player-name">
                  {player} {teamMode && `(Équipe ${teams[playerIndex]})`}
                </td>
                {Array.from({length: MAX_ROUNDS}, (_, roundIndex) => (
                  <td key={roundIndex} className="score-cell">
                    <div className="flex items-center justify-center gap-1">
                      {scores[playerIndex]?.[roundIndex] || 0}
                      <button
                        onClick={() => toggleMasteryBonus(roundIndex, playerIndex)}
                        disabled={gameEnded}
                        className={`mastery-button ${
                          masteryBonus[roundIndex] === playerIndex ? 'active' : ''
                        }`}
                      >
                        <Star className={`h-4 w-4 ${
                          masteryBonus[roundIndex] === playerIndex ? 'text-yellow-500' : 'text-gray-400'
                        }`} />
                      </button>
                    </div>
                  </td>
                ))}
                <td className="total-score">
                  {calculateTotal(playerIndex)}
                </td>
              </tr>
            ))}
            {teamMode && (
              <tr className="team-totals">
                <td colSpan={MAX_ROUNDS + 1}>Totaux par équipe</td>
                <td>
                  {Array.from({length: MAX_TEAMS}, (_, i) => i + 1).map(teamNum => (
                    <div key={teamNum}>
                      Équipe {teamNum}: {calculateTeamTotal(teamNum)}
                    </div>
                  ))}
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {gameEnded ? (
          <div className="mt-6 text-center">
            <h3 className="text-xl font-bold mb-4">
              {teamMode ? "Équipe gagnante" : "Gagnant"} : {getWinner()}
            </h3>
            <button onClick={resetGame} className="medieval-button">
              Nouvelle partie
            </button>
          </div>
        ) : (
          <div className="flex justify-end mt-4">
            <button onClick={handleNextTurn} className="medieval-button">
              {currentPlayer < playerCount - 1 ? 'Joueur suivant' : 'Manche suivante'}
            </button>
          </div>
        )}
      </div>
    </div>
  )

  return gameStarted ? renderGameScreen() : renderSetupScreen()
}

export default EtheryonCalculator
