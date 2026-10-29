# Portfolio-architecte-sophie-bluel

Code du projet 6 d'intégrateur web.

## Architecture

Ce repo git contient les 2 briques logicielles du projet 
- Frontend
- Backend

## Pour le lancer le code
### Backend
Ouvrir le dossier Backend et lire le README.md

### Frontend
Ouvrir le dossier Frontend et lancer liveserver de votre IDE

## Étape 0 — Environnement de développement

- Installer Node.js et npm.
- Dans `Backend`, lancer `npm install`. Si `.env` est absent, copier
  `.env.example` vers `.env` et renseigner un secret local.
- Lancer `npm start` dans `Backend` et laisser le terminal ouvert.
- Ouvrir `FrontEnd/index.html` avec Live Server dans VS Code.
- Consulter `http://localhost:5678/api-docs/` et tester `GET /api/works`
  ainsi que `GET /api/categories` avant de développer la galerie.

Le fichier `.env` et les dépendances installées restent hors de Git.

## Étape 1 — Versionnement

- `main` conserve le code d'origine fourni pour le projet.
- `dev` contient les évolutions, avec un commit par étape.
- Les étapes sont réalisées par groupes de deux : 0 et 1, 2 et 3, puis 4 et 5.1.
- Le rattachement au dépôt GitHub nécessite une connexion GitHub valide et
  l'adresse du dépôt personnel. Aucun dépôt distant n'est encore configuré.

## Avancement — Étape 5.1 incluse

La galerie et les filtres utilisent les données de l'API. Le lien `login`
ouvre `FrontEnd/login.html`, intégrée selon la maquette. Le formulaire de
connexion est uniquement visuel : son bouton n'envoie pas les identifiants.
L'authentification appartient à l'étape 5.2 et n'est pas implémentée ici.
 
## Astuce
 
Si vous désirez afficher le code du backend et du frontend, faites le dans 2 instances de VSCode différentes pour éviter tout problème
