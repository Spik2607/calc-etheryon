'use client'

import React, { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import '@/styles/medieval.css'

// Configuration des éléments avec leurs attributs
const elements = [
  { name: 'Eau', icon: '💧', color: 'var(--water)', gradient: 'from-blue-500 to-blue-700' },
  { name: 'Feu', icon: '🔥', color: 'var(--fire)', gradient: 'from-red-500 to-red-700' },
  { name: 'Terre', icon: '🌍', color: 'var(--earth)', gradient: 'from-green-500 to-green-700' },
  { name: 'Air', icon: '🌪️', color: 'var(--air)', gradient: 'from-gray-400 to-gray-600' },
  { name: 'Foudre', icon: '⚡', color: 'var(--lightning)', gradient: 'from-yellow-400 to-yellow-600' }
]

// Constantes du jeu
const MAX_PLAYERS = 8
const MAX_ROUNDS = 7
const MASTERY_BONUS = 15

// État initial du jeu
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

// Animations
const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 }
}

const EtheryonCalculator = () => {
  // États du jeu
  const [gameState, setGameState] = useState(initialGameState)
  
  // Déstructuration pour faciliter l'utilisation
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

  const calculateFinalScore = useCallback((elementScores) => {
    if (!elementScores?.length) return 0
    const maxElement = Math.max(...elementScores)
    return elementScores.reduce((sum, score) => 
      score === maxElement ? sum : sum - score, maxElement)
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

      // Calculer les nouveaux scores
      const newScores = prev.scores.map((playerScores, pIndex) => {
        if (pIndex !== playerIndex) return playerScores
        
        const roundScores = [...playerScores]
        roundScores[roundIndex] = calculateFinalScore(newElementScores[playerIndex][roundIndex])
        return roundScores
      })

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

      // Mettre à jour les scores avec le bonus de maîtrise
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

  // Composants de rendu mémorisés
  const ScoreTable = useMemo(() => (
    <div className="medieval-scroll-container">
      <table className="medieval-table">
        <thead>
          <tr>
            <th className="medieval-th">Joueur</th>
            {Array.from({ length: MAX_ROUNDS }, (_, i) => (
              <th key={i} className="medieval-th">M{i + 1}</th>
            ))}
            <th className="medieval-th">Total</th>
          </tr>
        </thead>
        <tbody>
          {playerNames.slice(0, playerCount).map((player, playerIndex) => (
            <tr 
              key={playerIndex}
              className={`
                medieval-tr
                ${currentPlayer === playerIndex ? 'medieval-tr-active' : ''}
              `}
            >
              <td className="medieval-td medieval-td-name">{player || `Joueur ${playerIndex + 1}`}</td>
              {Array.from({ length: MAX_ROUNDS }, (_, roundIndex) => (
                <td key={roundIndex} className="medieval-td medieval-td-score">
                  <div className="medieval-score">
                    {scores[playerIndex]?.[roundIndex] || 0}
                    {masteryBonus[roundIndex] === playerIndex && (
                      <div className="medieval-mastery">M</div>
                    )}
                  </div>
                </td>
              ))}
              <td className="medieval-td medieval-td-total">
                {calculateTotal(playerIndex)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ), [playerNames, playerCount, currentPlayer, scores, masteryBonus, calculateTotal])

  // Rendu principal
  return (
    <div className="medieval-theme">
      <header className="medieval-header">
        <div className="medieval-title-container">
          <Image 
            src="/images/scroll-left.png" 
            alt="" 
            width={50} 
            height={50} 
            className="medieval-scroll-decoration"
          />
          <h1 className="medieval-title">Calculatrice Etheryon</h1>
          <Image 
            src="/images/scroll-right.png" 
            alt="" 
            width={50} 
            height={50} 
            className="medieval-scroll-decoration"
          />
        </div>
      </header>

      <main className="medieval-main">
        <AnimatePresence mode="wait">
          {!gameStarted ? (
            <motion.div {...pageTransition} className="medieval-setup-container">
              <div className="medieval-setup-form">
                <h2 className="medieval-subtitle">Configuration de la Partie</h2>
                
                <div className="medieval-player-count">
                  <label className="medieval-label">Nombre de joueurs :</label>
                  <div className="medieval-button-group">
                    {[2, 3, 4, 5, 6, 7, 8].map((count) => (
                      <button
                        key={count}
                        onClick={() => handlePlayerCountChange(count)}
                        className={`medieval-count-button ${
                          playerCount === count ? 'medieval-count-button-active' : ''
                        }`}
                      >
                        {count}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="medieval-player-names">
                  <ScrollArea className="medieval-scroll-area">
                    {playerNames.slice(0, playerCount).map((name, index) => (
                      <div key={index} className="medieval-input-container">
                        <Input
                          placeholder={`Nom du joueur ${index + 1}`}
                          value={name}
                          onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                          className="medieval-input"
                        />
                      </div>
                    ))}
                  </ScrollArea>
                </div>

                <button
                  onClick={startGame}
                  disabled={playerNames.slice(0, playerCount).some(name => !name)}
                  className="medieval-start-button"
                >
                  Commencer la partie
                </button>
              </div>

              {ScoreTable}
            </motion.div>
          ) : (
            <motion.div {...pageTransition} className="medieval-game-container">
              <div className="medieval-game-content">
                <h2 className="medieval-round-title">
                  Tour de {playerNames[currentPlayer]} - Manche {currentRound}
                </h2>

                <div className="medieval-elements-grid">
                  {elements.map((element, index) => (
                    <div key={index} className="medieval-element">
                      <div className={`medieval-element-header ${element.gradient}`}>
                        <span className="medieval-element-icon">{element.icon}</span>
                        <span className="medieval-element-name">{element.name}</span>
                      </div>
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
                        className="medieval-element-input"
                      />
                    </div>
                  ))}
                </div>

                <button
                  onClick={nextTurn}
                  className="medieval-next-button"
                >
                  {currentPlayer < playerCount - 1 ? 'Joueur Suivant' : 'Manche Suivante'}
                </button>
              </div>

              {ScoreTable}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

export default EtheryonCalculator
