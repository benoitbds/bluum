# Bluum

**La beauté de la vie, en simulation.**

Bluum est un jeu web contemplatif où des formes de vie abstraites évoluent dans un monde 3D isométrique généré procéduralement. Chaque joueur crée un monde unique, lance l’évolution… puis observe.

> 🎮 *Pas d'interaction directe dans le MVP. Juste la vie qui pousse, mute, se reproduit ou meurt.*

---

## 🌱 Objectifs du projet

* Créer un **jeu web addictif mais apaisant** (type tamagotchi cosmique)
* Basé sur l’émergence visuelle et l’évolution génétique
* Jouable en navigateur, supportant une persistance serveur
* Rendu en **3D isométrique low-poly** via Three.js

---

## 🧠 Stack technique

| Composant        | Technologie                      |
| ---------------- | -------------------------------- |
| Frontend         | Vite + Three.js                  |
| Moteur de vie    | JS / TS modules                  |
| Rendu 3D         | Isométrique, flat shading        |
| Backend (option) | Node.js (à venir)                |
| Déploiement      | GitHub Pages (MVP local d'abord) |

---

## 📁 Structure des fichiers (MVP)

```bash
bluum/
├── index.html             # Entrée principale
├── vite.config.js         # Config Vite
├── src/
│   ├── main.js            # Initialisation renderer, caméra, animation
│   ├── world.js           # Génération du monde et ajout des entités
│   ├── evolution.js       # Logique de mutation, reproduction, sélection
│   ├── visuals.js         # Mapping gènes → visuel (formes, couleurs...)
│   └── data.js            # Données initiales des espèces
```

---

## 🧬 Données génétiques (MVP)

Chaque entité vivante possède un **génome** simple sous forme de tableau de traits :

```js
{
  size: 0.5,
  mutationRate: 0.1,
  r: 0.6,
  g: 0.8,
  b: 0.6
}
```

Ces traits déterminent la forme, la couleur et les comportements de l'entité dans le monde.

---

## 🔁 Boucle d’évolution (à améliorer)

* Reproduction asexuée avec mutations aléatoires
* Mort aléatoire ou par conditions environnementales (à venir)
* Apparition d’espèces divergentes

Fonction à enrichir : `simulateGeneration()` (dans `evolution.js`)

---

## 🤖 Pour contribuer (humain ou IA)

Tâches typiques pour Codex :

* Ajouter une **fonction de mutation douce**
* Générer des **formes visuelles différentes** (champignons, cristaux…)
* Gérer **l’apparition de nouvelles espèces** (spéciation)
* Ajouter une **timeline d’évolution** visuelle

---

## 🧭 Roadmap MVP

* [x] Affichage 3D d’entités
* [x] Génome de base
* [x] Mutation simple
* [ ] Boucle d’évolution complète
* [ ] Générateur de noms d’espèces
* [ ] Apparition aléatoire de nouvelles espèces

---

## 📜 Licence

MIT – projet open-source pour s’amuser, apprendre, et observer la vie éclore.

> Codex, tu sais ce qu’il te reste à faire 🌱
