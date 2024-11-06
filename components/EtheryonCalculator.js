'use client';

import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Checkbox } from './ui/checkbox';
import { Switch } from './ui/switch';
import { SunIcon, MoonIcon } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const elements = ['Eau', 'Feu', 'Terre', 'Air', 'Foudre'];

const EtheryonCalculator = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [playerCount, setPlayerCount] = useState(3);
  const [playerNames, setPlayerNames] = useState(Array(8).fill(''));
  const [elementScores, setElementScores] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [scores, setScores] = useState([]);
  const [masteryBonus, setMasteryBonus] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [teamMode, setTeamMode] = useState(false);
  const [teams, setTeams] = useState([]);

  // Effet pour le mode sombre
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Gestionnaires d'événements
  const handlePlayerCountChange = (count) => {
    setPlayerCount(count);
    setPlayerNames(prev => {
      const newNames = [...prev];
      newNames.length = count;
      return newNames.fill('', prev.length, count);
    });
    setTeams(Array(count).fill(0));
  };

  const handlePlayerNameChange = (index, name) => {
    setPlayerNames(prev => {
      const newNames = [...prev];
      newNames[index] = name;
      return newNames;
    });
  };

  const handleTeamChange = (index, teamNumber) => {
    setTeams(prev => {
      const newTeams = [...prev];
      newTeams[index] = teamNumber;
      return newTeams;
    });
  };

  const startGame = () => {
    setElementScores(Array(playerCount).fill().map(() => 
      Array(7).fill().map(() => Array(5).fill(0))
    ));
    setScores(Array(playerCount).fill().map(() => Array(7).fill(0)));
    setMasteryBonus(Array(7).fill(-1));
    setGameStarted(true);
  };

  // Calculs de scores
  const calculateFinalScore = (elementScores) => {
    if (!elementScores || elementScores.length === 0) return 0;
    const maxElement = Math.max(...elementScores);
    return elementScores.reduce((sum, score) => {
      if (score === maxElement) return sum;
      return sum - score;
    }, maxElement);
  };

  const handleElementScoreChange = (playerIndex, roundIndex, elementIndex, newScore) => {
    const scoreValue = parseInt(newScore) || 0;
    
    setElementScores(prev => {
      const newElementScores = [...prev];
      if (!newElementScores[playerIndex]) {
        newElementScores[playerIndex] = Array(7).fill().map(() => Array(5).fill(0));
      }
      if (!newElementScores[playerIndex][roundIndex]) {
        newElementScores[playerIndex][roundIndex] = Array(5).fill(0);
      }
      newElementScores[playerIndex][roundIndex][elementIndex] = scoreValue;
      return newElementScores;
    });

    setScores(prev => {
      const newScores = [...prev];
      if (!newScores[playerIndex]) {
        newScores[playerIndex] = Array(7).fill(0);
      }
      const roundScores = elementScores[playerIndex][roundIndex].map((score, idx) => 
        idx === elementIndex ? scoreValue : score
      );
      newScores[playerIndex][roundIndex] = calculateFinalScore(roundScores);
      return newScores;
    });
  };

  // Gestion des bonus
  const toggleMasteryBonus = (roundIndex, playerIndex) => {
    setMasteryBonus(prev => {
      const newMasteryBonus = [...prev];
      if (newMasteryBonus[roundIndex] === playerIndex) {
        newMasteryBonus[roundIndex] = -1;
      } else {
        if (newMasteryBonus[roundIndex] !== -1) {
          setScores(prevScores => prevScores.map((playerScores, pIndex) => 
            pIndex === newMasteryBonus[roundIndex]
              ? playerScores.map((score, rIndex) => 
                  rIndex === roundIndex ? score - 15 : score
                )
              : playerScores
          ));
        }
        newMasteryBonus[roundIndex] = playerIndex;
      }
      return newMasteryBonus;
    });

    setScores(prev => prev.map((playerScores, pIndex) => 
      pIndex === playerIndex
        ? playerScores.map((score, rIndex) => 
            rIndex === roundIndex 
              ? score + (masteryBonus[roundIndex] === playerIndex ? -15 : 15)
              : score
          )
        : playerScores
    ));
  };

  const calculateTotal = (playerIndex) => {
    return (scores[playerIndex] || []).reduce((sum, score) => sum + (score || 0), 0);
  };

  const getWinner = () => {
    if (teamMode) {
      const teamScores = teams.reduce((acc, team, index) => {
        if (!acc[team]) acc[team] = 0;
        acc[team] += calculateTotal(index);
        return acc;
      }, {});
      const maxScore = Math.max(...Object.values(teamScores));
      const winningTeams = Object.entries(teamScores)
        .filter(([_, score]) => score === maxScore)
        .map(([team]) => `Équipe ${team}`);
      return winningTeams.join(' et ');
    } else {
      const totals = playerNames.slice(0, playerCount).map((_, index) => calculateTotal(index));
      const maxScore = Math.max(...totals);
      const winners = playerNames.filter((_, index) => calculateTotal(index) === maxScore);
      return winners.join(' et ');
    }
  };

  // Components de rendu
  const renderElementInputs = (playerIndex, roundIndex) => (
    <div className="grid grid-cols-5 gap-2">
      {elements.map((element, elementIndex) => (
        <div key={elementIndex} className="flex flex-col items-center">
          <label className="text-sm mb-1">{element}</label>
          <Input
            type="number"
            value={elementScores[playerIndex]?.[roundIndex]?.[elementIndex] || 0}
            onChange={(e) => handleElementScoreChange(playerIndex, roundIndex, elementIndex, e.target.value)}
            className="w-full text-center"
          />
        </div>
      ))}
    </div>
  );

  const renderMasterySection = () => (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Maîtrise par manche :</h3>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-700">
            <th className="border p-2">Manche</th>
            {playerNames.slice(0, playerCount).map((player, index) => (
              <th key={index} className="border p-2">{player}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {masteryBonus.map((masteryPlayerIndex, roundIndex) => (
            <tr key={roundIndex}>
              <td className="border p-2 text-center">{roundIndex + 1}</td>
              {playerNames.slice(0, playerCount).map((_, playerIndex) => (
                <td key={playerIndex} className="border p-2 text-center">
                  <Checkbox
                    checked={masteryPlayerIndex === playerIndex}
                    onCheckedChange={() => toggleMasteryBonus(roundIndex, playerIndex)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderGameContent = () => (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Tour de {playerNames[currentPlayer]} - Manche {currentRound}</CardTitle>
      </CardHeader>
      <CardContent>
        {renderElementInputs(currentPlayer, currentRound - 1)}
        <div className="overflow-x-auto mt-4">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                <th className="border p-2">Joueur</th>
                {[1, 2, 3, 4, 5, 6, 7].map(round => (
                  <th key={round} className="border p-2">Manche {round}</th>
                ))}
                <th className="border p-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {playerNames.slice(0, playerCount).map((player, playerIndex) => (
                <tr key={playerIndex}>
                  <td className="border p-2">
                    {player} {teamMode && `(Équipe ${teams[playerIndex]})`}
                  </td>
                  {(scores[playerIndex] || []).map((score, roundIndex) => (
                    <td key={roundIndex} className="border p-2 text-center">
                      {score || 0}
                      {masteryBonus[roundIndex] === playerIndex && ' (M)'}
                    </td>
                  ))}
                  <td className="border p-2 text-center font-bold">
                    {calculateTotal(playerIndex)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {renderMasterySection()}
        <div className="flex justify-between mt-4">
          <Button onClick={() => setEditMode(!editMode)}>
            {editMode ? "Terminer l'édition" : "Modifier les scores"}
          </Button>
          <Button 
            onClick={() => {
              if (currentPlayer < playerCount - 1) {
                setCurrentPlayer(currentPlayer + 1);
              } else {
                setCurrentPlayer(0);
                if (currentRound < 7) {
                  setCurrentRound(currentRound + 1);
                } else {
                  setGameEnded(true);
                }
              }
            }}
          >
            Joueur suivant
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  // Rendu principal
  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="container mx-auto p-4 dark:bg-gray-800 dark:text-white">
        <div className="flex justify-between items-center mb-4">
          <a 
            href="https://www.etheryon.fr" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-100"
          >
            Site officiel Etheryon
          </a>
          <div className="flex items-center">
            <SunIcon className="h-6 w-6 mr-2" />
            <Switch checked={darkMode} onCheckedChange={(checked) => setDarkMode(checked)} />
            <MoonIcon className="h-6 w-6 ml-2" />
          </div>
        </div>

        {!gameStarted ? (
          <Card className="w-96 mx-auto">
            <CardHeader>
              <CardTitle>Configuration du jeu Etheryon</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <label className="block mb-2">Nombre de joueurs :</label>
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
              
              <div className="mb-4">
                <label className="flex items-center">
                  <Checkbox
                    checked={teamMode}
                    onCheckedChange={(checked) => setTeamMode(checked)}
                    className="mr-2"
                  />
                  Mode équipe
                </label>
              </div>

              <ScrollArea className="h-60">
                {playerNames.slice(0, playerCount).map((name, index) => (
                  <div key={index} className="mb-2 flex items-center">
                    <Input
                      placeholder={`Joueur ${index + 1}`}
                      value={name}
                      onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                      className="mr-2"
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
                            <SelectItem key={teamNumber} value={teamNumber.toString()}>
                              Équipe {teamNumber}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                ))}
              </ScrollArea>

              <Button 
                onClick={startGame} 
                className="w-full mt-4"
                disabled={playerNames.slice(0, playerCount).some(name => !name)}
              >
                Commencer la partie
              </Button>
            </CardContent>
          </Card>
       ) : gameEnded ? (
          <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle>Résultats finaux</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-700">
                      <th className="border p-2">Joueur</th>
                      {[1, 2, 3, 4, 5, 6, 7].map(round => (
                        <th key={round} className="border p-2">Manche {round}</th>
                      ))}
                      <th className="border p-2">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {playerNames.slice(0, playerCount).map((player, playerIndex) => (
                      <tr 
                        key={playerIndex} 
                        className={player === getWinner() ? "bg-green-100 dark:bg-green-700" : ""}
                      >
                        <td className="border p-2">
                          {player} {teamMode && `(Équipe ${teams[playerIndex]})`}
                        </td>
                        {(scores[playerIndex] || []).map((score, roundIndex) => (
                          <td key={roundIndex} className="border p-2 text-center">
                            {editMode ? (
                              <div>
                                {renderElementInputs(playerIndex, roundIndex)}
                              </div>
                            ) : (
                              <>
                                {score || 0}
                                {masteryBonus[roundIndex] === playerIndex && ' (M)'}
                              </>
                            )}
                          </td>
                        ))}
                        <td className="border p-2 text-center font-bold">
                          {calculateTotal(playerIndex)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {renderMasterySection()}

              <div className="mt-8 text-center">
                <div className="text-2xl font-bold mb-4">
                  {teamMode ? "Équipe gagnante" : "Gagnant"} : {getWinner()}
                </div>
                
                <div className="flex justify-center gap-4">
                  <Button onClick={() => setEditMode(!editMode)}>
                    {editMode ? "Terminer l'édition" : "Modifier les scores"}
                  </Button>
                  
                  <Button 
                    onClick={() => {
                      setGameStarted(false);
                      setGameEnded(false);
                      setCurrentPlayer(0);
                      setCurrentRound(1);
                      setScores([]);
                      setElementScores([]);
                      setMasteryBonus(Array(7).fill(-1));
                      setEditMode(false);
                    }}
                  >
                    Nouvelle partie
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          renderGameContent()
        )}
      </div>
    </div>
  );
};

export default EtheryonCalculator;
