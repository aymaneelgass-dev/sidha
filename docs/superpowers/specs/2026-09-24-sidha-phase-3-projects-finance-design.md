# SIDHA Phase 3 — Projects + finance projet simplifiée

Date : 2026-09-24. Statut : proposition à valider, aucune implémentation autorisée.
Branche : `feat/sidha-phase-3-projects-finance`. Base : `df15886`.

## Intention et périmètre

Donner à une petite agence audiovisuelle un registre de productions et une fiche projet qui réunissent contexte créatif, étape de production et situation financière réelle. Préserver Laravel 13, React/TypeScript, Inertia, Tailwind, MySQL, Vite et les fonctionnalités Phases 1/2.

Uniquement Projects et dépenses rattachées aux projets. Aucun module Finance séparé, Studio, Calendar, AI, tâches, médias, commentaires, notifications, affectations d'équipe, devis, factures, TVA, paiements ou comptabilité. Le dashboard de démonstration Phase 1 reste inchangé.

## Conventions constatées

- Projects est actuellement une route `coming-soon`; la navigation existe déjà.
- Routes métier sous `auth`, `active`, `verified`; policies avec `isActive()` et `isAdmin()`; autorisation serveur via Gates et Form Requests.
- Enums PHP, modèles Eloquent, props Inertia typées, routes Wayfinder et flash/toasts existants.
- UI en anglais, primitives accessibles existantes, thèmes Light/Dark/System.
- PHPUnit utilise SQLite en mémoire; MySQL reste la base applicative. Pint, PHPStan niveau 7, TypeScript, lint et build sont configurés.
- Le seeder Phase 2 crée des données fictives mais n'est pas réexécutable sans doublons : ne pas le relancer aveuglément sur la base locale.

## Données et règles proposées

`Project` : id, name (150 caractères), client_id obligatoire, type, status (Brief par défaut), budget obligatoire, start_date/deadline nullables, brief nullable (10 000 caractères), timestamps.

Référence publique calculée depuis l'id : `SID-` et identifiant sur au moins trois chiffres (`SID-001`, `SID-1000`). Stable, unique par construction, non modifiable, sans compteur `MAX+1` ni colonne redondante. Recherche par référence prise en charge.

Types : Music Video, Advertisement, Corporate, Social Media. Statuts : Brief, Pre-production, Production, Post-production, Validation, Delivered, Archived. Stockage en chaînes normalisées et enums PHP, libellés anglais côté interface.

`ProjectExpense` : id, project_id obligatoire, label (150 caractères), amount obligatoire, expense_date nullable, notes nullables (5 000 caractères), timestamps. Relations `Client::projects`, `Project::client`, `Project::expenses`, `ProjectExpense::project`. Clés étrangères protégeant les liens; aucune suppression de projet exposée.

- MAD uniquement. Budget `DECIMAL(12,2)` entre 0 et 9 999 999 999,99; dépense strictement positive, même plafond. Maximum deux décimales, pas d'arrondi silencieux des saisies.
- Calcul serveur exact en centimes entiers; props monétaires en chaînes décimales. Total et marge calculés depuis toutes les dépenses, jamais persistés, indépendants de leur pagination.
- Marge estimée = budget − dépenses; zéro dépense donne 0,00 et la marge peut être négative. Aucun pourcentage ni indicateur financier supplémentaire.
- Dates civiles `YYYY-MM-DD`; deadline >= start_date si les deux sont renseignées. Aucun décalage de jour lié au fuseau dans l'affichage. Dates absentes explicitement indiquées.
- Sélection des clients actifs/inactifs. Client archivé exclu d'une nouvelle affectation, mais conservable sur un projet existant; archiver un client ne masque pas ses projets.
- Admin peut changer librement l'étape, y compris revenir en arrière. Pas d'historique ni de transitions obligatoires.
- Archivage confirmé, sans effacement. Projet archivé toujours consultable et modifiable par Admin; retour à une étape active via édition. Archivage n'est pas un verrou financier.

## Autorisations et parcours

Admin crée, consulte, modifie et archive les projets; ajoute, modifie et supprime leurs dépenses. Member consulte les mêmes données, finances incluses, sans mutation. Reprendre les policies Phase 2 et exposer les capacités dans les props `can`; aucun second système de rôles.

Routes Projects index/create/store/show/edit/update et PATCH archive, sans destroy. Dépenses via POST/PUT/DELETE imbriqués sous le projet. Binding limité au projet parent : une dépense d'un autre projet doit être inaccessible à cette URL, y compris pour Admin.

Formulaires projet sur pages dédiées. Dépenses dans une boîte de dialogue compacte accessible depuis la fiche. Validation au champ, saisie préservée en cas d'erreur, soumission désactivée pendant traitement, retour/toast après succès. Confirmation explicite avant archivage et suppression de dépense.

## Direction visuelle — production desk

Approche retenue : registre éditorial et feuille de production. Un kanban multiplierait les colonnes sur mobile; une grille de grandes cards réduirait la densité. Ici, la typographie et l'alignement portent l'identité audiovisuelle sans images fictives ou décoration gratuite.

### Projects workspace

En-tête compact « Projects / Production desk », contexte court et bouton Admin « New project ». Une ligne de recherche et filtres, puis une liste de bandes éditoriales séparées par des filets fins.

Chaque bande : référence et type dans une colonne étroite; nom dominant et client au centre; statut, deadline et budget dans une zone de lecture rapide à droite. Rythme typographique contrasté, chiffres tabulaires, violet limité aux actions/focus/étape courante. Lien projet explicite utilisable au clavier, pas de conteneur cliquable ambigu.

Recherche nom/référence/client; filtres statut/type combinables et persistés dans l'URL. Valeur statut par défaut « All » incluant les archives, sans filtre implicite. Tri par création décroissante puis id, pagination serveur de 15 projets conservant les filtres. Aucun résultat et premier projet ont des états distincts; Member ne voit pas d'appel à créer. Si aucun client éligible, Admin voit un lien vers la création de client.

Sur mobile, chaque bande se réorganise en bloc compact : référence/type, titre/client, puis statut/date/budget. Pas de tableau desktop simplement compressé.

### Fiche projet

Composition desktop légèrement asymétrique : grand titre et brief dans les deux tiers principaux, faits de production dans le tiers latéral. Référence/type au-dessus du titre; client lié à sa fiche; statut, début et deadline visibles; actions Admin compactes.

Sous l'identité, liste ordonnée des six étapes de Brief à Delivered. L'étape courante est signalée par texte et `aria-current="step"`; les autres restent neutres, sans prétendre prouver leur achèvement. En Archived, afficher l'état d'archive et aucune étape courante, car l'étape précédente n'est pas conservée. Sur mobile, disposition en deux colonnes ou verticale sans défilement horizontal obligatoire.

Une bande financière commune présente Budget / Expenses / Est. margin avec chiffres très lisibles et fins séparateurs. Marge négative explicitement libellée, pas uniquement rouge. En dessous, détail des dépenses (libellé, date, notes, montant, actions Admin), tri date décroissante, dates absentes en dernier puis id décroissant; pagination de 15 si nécessaire. Les totaux portent toujours sur l'ensemble.

Mobile : identité, faits clés, étapes, chiffres, brief, dépenses dans cet ordre. Brief et notes en texte simple avec retours à la ligne, sans HTML interprété. États vides sobres et utiles.

## Accessibilité et qualité

Réutiliser shell, tokens et primitives existants sans restyler Clients/Team. Titres sémantiques compatibles avec le shell, labels persistants, erreurs associées, focus visible, navigation clavier et retour du focus après dialogue. Texte/statut compréhensible sans couleur, chiffres et noms longs sans débordement, contraste vérifié dans les deux thèmes. Respect de reduced-motion existant.

Jeu fictif : environ sept productions couvrant les quatre types et les sept statuts, clients explicitement Demo, dépenses réalistes de tournage/montage/location. Inclure absence de dépense, dates/brief absents, budget nul, marge positive/nulle/négative. Seeder Phase 3 dédié, réexécutable, réservé aux environnements local/testing, sans réécriture des enregistrements métier existants.

Acceptation : droits serveur testés, montants exacts après chaque mutation, filtres/pagination fiables, projets consultables sur desktop/mobile dans tous les thèmes, aucune régression connue Phase 1/2. Tests ciblés par tâche; contrôles complets et une seule revue indépendante globale à la fin.
