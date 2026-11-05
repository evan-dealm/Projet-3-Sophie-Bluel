# Vérifications finales — étape 9

Exécutées le 5 novembre 2026 dans Chromium, avec le frontend servi en HTTP
sur le port 5500 et le backend fourni sur le port 5678.

## API réelle et parcours complet

- GET works : 200, 11 projets existants ; GET categories : 200, 3 catégories.
- Connexion avec mauvais mot de passe : 401 et message français dans le formulaire.
- DELETE sans authentification sur un identifiant inexistant : 401.
- Connexion avec le compte de test : redirection et mode édition affiché.
- Refus d'un fichier texte et d'un PNG supérieur à 4 Mio.
- Prévisualisation PNG ; bouton désactivé avec titre composé d'espaces.
- Ajout d'un projet temporaire par le formulaire : 201, 12 éléments visibles
  dans les deux galeries ; persistance vérifiée après rechargement.
- Suppression de ce même projet : 204, retour à 11 projets dans les deux galeries.
- Déconnexion et retour aux filtres publics ; filtrage par catégorie vérifié.

## Erreurs simulées dans le navigateur

- Interruption réseau pendant DELETE : erreur affichée, aucun projet retiré,
  bouton réactivé pour réessayer.
- Réponse DELETE 401 : jeton retiré, lien login rétabli et reconnexion possible.

## Interface et contrôles statiques

- Modale unique, navigation aller/retour, croix, fond et événement clavier Échap.
- Rendu des vues galerie et ajout inspecté visuellement selon les maquettes.
- Absence de débordement horizontal à 390 px de largeur.
- Syntaxe des quatre fichiers JavaScript : `node --check`.
- Espacements et conflits : `git diff --check`.

Les clics des parcours automatisés sont déclenchés dans le DOM. La fermeture
par Échap a aussi un gestionnaire explicite ; le dialog natif assure le confinement
et la restauration du focus. La checklist reproductible et les exemples Swagger
sont dans README.md.

Le projet temporaire, son fichier image et les changements de base SQLite issus
uniquement des tests ont été nettoyés. Aucun projet d'origine n'a été supprimé.
