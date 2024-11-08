# Calculatrice Etheryon

Une calculatrice spécialisée pour le jeu Etheryon, permettant de :

- Calculer les scores basés sur les éléments (Eau, Feu, Terre, Air, Foudre)
- Gérer les bonus de maîtrise (+15 points)
- Supporter le mode équipe
- Suivre les scores sur plusieurs manches

## Fonctionnalités

- ⚡ Calcul automatique des scores en fonction des éléments
- 🌟 Gestion des bonus de maîtrise (+15 points)
- 👥 Mode équipe
- 🌓 Interface sombre/claire adaptative
- 📊 Historique des scores par manche
- 🏆 Vue des résultats finaux

## Utilisation

Visitez [https://spik2607.github.io/calc-etheryon/](https://spik2607.github.io/calc-etheryon/) pour utiliser la calculatrice en ligne.

### Comment jouer

1. Choisissez le nombre de joueurs (2-8)
2. Activez le mode équipe si nécessaire
3. Entrez les noms des joueurs
4. Pour chaque manche :
   - Entrez les points des éléments
   - Attribuez les bonus de maîtrise
   - Passez au joueur suivant

## Développement

```bash
# Installation des dépendances
npm install --legacy-peer-deps

# Lancement en mode développement
npm run dev

# Construction pour production
npm run build
```

### Structure du projet

```
calc-etheryon/
├── app/
│   ├── globals.css
│   ├── layout.js
│   └── page.js
├── components/
│   ├── EtheryonCalculator.js
│   └── ui/
├── lib/
│   └── utils.js
└── public/
```

## Technologies utilisées

- Next.js 14
- React 18
- Tailwind CSS
- Radix UI
- Lucide Icons

## Licence

MIT

---

Développé avec ❤️ pour la communauté Etheryon
