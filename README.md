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
- Chaque étape possède son propre commit sur `dev`.
- Le rattachement au dépôt GitHub nécessite une connexion GitHub valide et
  l'adresse du dépôt personnel. Aucun dépôt distant n'est encore configuré.

## Avancement — Étape 9

Toutes les fonctionnalités demandées sont implémentées : galerie et filtres,
connexion, déconnexion, mode édition, modale, suppression et ajout de photos
sans rechargement. Les étapes 5.2, 5.3, 6, 7, 8.1, 8.2 et 9 ont chacune un commit.

### Démarrer le frontend sans extension

Depuis `FrontEnd`, lancer `python -m http.server 5500 --bind 127.0.0.1`,
puis ouvrir http://127.0.0.1:5500. Live Server reste possible.
Le backend doit tourner en parallèle sur le port 5678.

### Choix de fonctionnement

- Le jeton JWT est conservé dans `sessionStorage` pour l'onglet courant.
  Il est supprimé à la déconnexion ; son expiration est vérifiée côté client.
  Le backend vérifie réellement la signature et les droits à chaque modification.
- Les photos acceptées par le formulaire sont JPG/PNG, au plus 4 Mio,
  conformément à la maquette. Le titre doit contenir autre chose que des espaces.
- Les catégories proviennent du backend ; les filtres utilisent les travaux déjà chargés.
- Une seule modale native `dialog` gère les deux vues, le clavier Échap,
  le focus, la croix et le clic sur le fond.
- Le backend fourni est conservé. Le contact et la récupération du mot de passe
  n'ont pas d'API dans ce projet et ne constituent pas des fonctionnalités livrées.

## API : rôle, utilisation et tests

L'API permet au navigateur de lire ou modifier les données persistantes dans
SQLite. Les images sont servies par le backend. `FrontEnd/assets/api.js` fixe
l'adresse locale et fournit les fonctions communes de requête et de session.

| Méthode et chemin | Utilisation | Authentification | Succès |
| --- | --- | --- | --- |
| `GET /api/works` | Charger la galerie | Non | 200 |
| `GET /api/categories` | Charger filtres et liste du formulaire | Non | 200 |
| `POST /api/users/login` | Envoyer email et password en JSON, recevoir le JWT | Non | 200 |
| `POST /api/works` | Envoyer image, title et category en FormData | Bearer JWT | 201 |
| `DELETE /api/works/{id}` | Supprimer le projet choisi | Bearer JWT | 204 |

### Tester dans Swagger

1. Démarrer le backend puis ouvrir http://localhost:5678/api-docs/.
2. Déplier `GET /works`, choisir **Try it out**, puis **Execute** ; vérifier 200
   et le tableau de projets. Faire de même pour `GET /categories`.
3. Tester `POST /users/login` avec
   `{"email":"sophie.bluel@test.tld","password":"S0phie"}`.
   Copier le champ `token` de la réponse 200.
4. Cliquer **Authorize**, coller le jeton seul (sans écrire Bearer), puis valider.
5. Tester `POST /works` avec une image JPG/PNG, un titre de test et un identifiant
   de catégorie renvoyé par l'API ; vérifier 201 et noter l'`id` créé.
6. Tester `DELETE /works/{id}` avec **uniquement cet id de test** ; la réponse
   réelle est 204, même si le Swagger fourni annonce 200. Vérifier sa disparition
   avec `GET /works`. Le backend fourni ne supprime pas le fichier image du disque.
7. Un mauvais mot de passe donne 401, un email inconnu 404. Une modification
   sans jeton ou avec un jeton invalide donne 401.

Ne pas définir manuellement `Content-Type` lors d'un envoi FormData : le navigateur
ajoute lui-même la séparation multipart. Pour les modifications, l'en-tête est
`Authorization: Bearer VOTRE_JETON`.

### Vérifications manuelles dans le navigateur

- Hors connexion : projets affichés et filtres fonctionnels, aucun outil d'édition.
- Connexion : champs obligatoires, identifiants incorrects, serveur arrêté, puis
  connexion valide avec le compte de test du README backend.
- Mode connecté : bandeau édition, logout, bouton modifier, filtres masqués.
- Modale : ouverture répétée, croix, fond, Échap, retour et navigation au clavier.
- Ajout : prévisualisation ; refus des fichiers trop grands ou non JPG/PNG ;
  validation désactivée avec un titre vide ou une catégorie manquante.
- Ajouter un projet de test, vérifier immédiatement les deux galeries puis recharger
  pour confirmer sa persistance ; le supprimer et vérifier les deux galeries.
- Couper le backend pendant une modification : afficher une erreur, conserver
  les données visibles et permettre de réessayer. Tester aussi un jeton expiré.
- Déconnexion : retour au mode public et jeton absent du stockage de session.

## Astuce
 
Si vous désirez afficher le code du backend et du frontend, faites le dans 2 instances de VSCode différentes pour éviter tout problème
