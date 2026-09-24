# SIDHA Phase 3 — Plan d'implémentation

Statut : proposé, en attente de validation utilisateur du design et du plan.

**Objectif :** livrer Projects et la finance simple de chaque projet.
**Spec :** [Design Phase 3](../specs/2026-09-24-sidha-phase-3-projects-finance-design.md).
**Architecture :** Eloquent + enums + Form Requests + policies, contrôleurs Inertia, props React typées et routes Wayfinder. Calculs financiers côté serveur, sans API ni dépendance supplémentaire.
**Stack :** Laravel 13, PHP 8.3+, MySQL, React/TypeScript, Inertia, Tailwind, Vite; outils existants conservés.

## Exécution et contraintes

- Implémentation native dans cette session avec `superpowers:executing-plans`, seulement après validation. Aucun implementer/reviewer par tâche; une revue indépendante finale du diff complet.
- Travailler exclusivement sur `feat/sidha-phase-3-projects-finance`, base `df15886`. Petits commits cohérents autorisés. Aucun reset destructif, clean, push, merge, déploiement ou Phase 4.
- Réutiliser Phases 1/2; UI anglaise et thèmes existants. Ne pas convertir le dashboard de démonstration. Ne modifier aucune donnée locale par une réinitialisation de base.
- Tests comportementaux ciblés avant/pendant chaque tâche; suite complète et navigateur à la fin seulement. Documenter brièvement les résultats dans ce plan pendant l'exécution.

## Points de vigilance transversaux

1. Requêtes forgées Member et comptes suspendus : refus serveur (Tasks 1/2/4).
2. Dépense d'un autre projet dans une URL imbriquée : aucun accès ni modification (Task 4).
3. Centimes, sommes supérieures au budget et pagination : total exact et marge négative conservée (Tasks 1/4).
4. Client archivé après affectation et dates absentes : historique consultable, formulaires utilisables (Tasks 2/3).
5. Longs textes/montants, filtres vides, clavier et thème : contenu lisible et actions accessibles (Tasks 2/3/5).

## Task 1 — Project + ProjectExpense : persistence, validation et authorization

Fichiers : nouvelles migrations `create_projects_table` et `create_project_expenses_table`; `app/Models/{Project,ProjectExpense}.php`, relation dans `Client.php`; `app/Enums/{ProjectType,ProjectStatus}.php`; factories correspondantes; `app/Policies/{ProjectPolicy,ProjectExpensePolicy}.php`; `app/Http/Requests/Projects/{ProjectIndexRequest,StoreProjectRequest,UpdateProjectRequest}.php` et `ProjectExpenses/{StoreProjectExpenseRequest,UpdateProjectExpenseRequest}.php`.

- [ ] Écrire puis exécuter les tests ciblés modèles/policies : relations, enums, référence dérivée stable dépassant 999, casts décimaux, Admin/Member/compte suspendu.
- [ ] Ajouter schéma, modèles, factories, policies et règles de validation de la spec; référence non assignable, clés étrangères protégées. Garder les colonnes portables MySQL/SQLite.
- [ ] Vérifier `tests/Unit/Models/ProjectTest.php`, `ProjectExpenseTest.php` et `tests/Unit/Policies/ProjectPolicyTest.php`, `ProjectExpensePolicyTest.php` avec `php artisan test` ciblé. Les validations HTTP seront exercées par les routes Tasks 2/4.

Livrable : socle de données et droits, aucune modification de l'authentification.

## Task 2 — Projects workspace : liste, recherche, filtres et CRUD Admin

Fichiers : `app/Http/Controllers/ProjectController.php`, `routes/web.php`, `resources/js/types/project.ts`; `resources/js/pages/projects/{index,create,edit,show}.tsx`; `resources/js/components/projects/{project-list,project-form,project-status-badge,project-archive-dialog}.tsx`; `tests/Feature/Projects/{ProjectReadTest,ProjectManagementTest}.php`; `tests/Feature/ComingSoonPagesTest.php`.

- [ ] Tester accès, création/édition/archivage Admin, refus de toutes mutations Member, validations montants/dates/enums/client et conservation de la référence. Tester le client archivé déjà lié et l'interdiction d'une nouvelle affectation à un client archivé.
- [ ] Remplacer uniquement la route Projects d'attente; préserver le nom `projects.index`, les middlewares et la navigation. Implémenter filtres combinés, recherche nom/référence/client, tri stable, pagination 15 et props `can`, avec chargement des relations sans N+1.
- [ ] Construire le registre éditorial responsive, formulaires dédiés, états vides et confirmation d'archive. Livrer une fiche minimale fonctionnelle pour les redirections, enrichie Task 3. Régénérer les routes Wayfinder selon le mécanisme existant.
- [ ] Retirer seulement Projects des attentes Coming Soon; exécuter `php artisan test tests/Feature/Projects` et `php artisan test tests/Feature/ComingSoonPagesTest.php`.

Livrable : parcours projet utilisable, création/lecture/modification/archivage; aucune suppression définitive.

## Task 3 — Project detail + workflow audiovisuel

Fichiers : enrichir `projects/show.tsx`, `ProjectController.php` et `types/project.ts`; créer `resources/js/components/projects/{project-workflow,project-facts}.tsx`; compléter `ProjectReadTest.php`.

- [ ] Tester les props réelles de détail, client lié, dates/brief absents, sept statuts et visibilité Member.
- [ ] Construire la composition titre/brief/faits, la liste d'étapes accessible et sa disposition mobile. Aucun historique, pourcentage ou achèvement supposé; archive sans étape courante.
- [ ] Vérifier données longues, texte échappé, dates civiles et actions Admin via les composants existants; exécuter le test de lecture ciblé. Préparer l'emplacement de la bande financière Task 4 sans afficher de faux chiffres.

Livrable : identité visuelle de la fiche et compréhension immédiate de la production.

## Task 4 — Expenses + Budget / Expenses / Estimated Margin

Fichiers : `app/Http/Controllers/ProjectExpenseController.php`, `app/Actions/Projects/CalculateProjectFinancials.php`, routes imbriquées; enrichir contrôleur/props/fiche; `resources/js/components/projects/{project-financial-summary,project-expense-list,project-expense-dialog,project-expense-delete-dialog}.tsx`; `tests/Feature/Projects/{ProjectExpenseTest,ProjectFinancialsTest}.php`.

- [ ] Tester CRUD Admin, refus Member, binding parent/enfant, labels/montants/dates/notes invalides, succès et erreurs conservant la saisie.
- [ ] Calculer budget/total/marge exactement en centimes côté PHP; transmettre des chaînes décimales. Tester 0,10 + 0,20, budget nul, dépassement, plusieurs pages de dépenses et recalcul après modification/suppression.
- [ ] Implémenter les routes et dialogues accessibles, confirmation de suppression, pagination et ordre des dépenses, bande financière réelle et marge négative explicite. Ne pas utiliser la page de dépenses seule comme source du total.
- [ ] Exécuter `php artisan test tests/Feature/Projects/ProjectExpenseTest.php` et `php artisan test tests/Feature/Projects/ProjectFinancialsTest.php`.

Livrable : finances projet exactes et mutations protégées.

## Task 5 — Demo data + regression + responsive/accessibility + final review

Fichiers : `database/seeders/SidhaPhaseThreeDemoSeeder.php`, intégration locale contrôlée dans `DatabaseSeeder.php`; `tests/Feature/Database/SidhaPhaseThreeDemoSeederTest.php`; ce plan pour le bilan. Retouches limitées aux findings constatés.

- [ ] Ajouter les sept productions fictives de la spec. Tester interdiction hors local/testing, réexécution sans doublon et absence de modification des données métier préexistantes. Ne pas relancer le seeder Phase 2 sur une base déjà peuplée.
- [ ] Exécuter les tests Projects/seeders pertinents puis `php artisan test`, `vendor/bin/pint --test`, `vendor/bin/phpstan analyse`, `npm run types:check`, `npm run check`, `npm run build`. Utiliser les exécutables Windows disponibles si nécessaire; ne pas relancer les mêmes contrôles sans changement pertinent.
- [ ] Vérifier les nouvelles migrations sur MySQL local sans destruction; vérifier au navigateur un parcours Admin complet et un parcours Member lecture seule : liste/filtres, création, édition, workflow, dépenses, archivage.
- [ ] Vérifier principalement 1440 px et 375 px, et une largeur intermédiaire pour le repli : liste, fiche et formulaire. Light/Dark/System, absence de débordement, clavier, labels/erreurs, focus des confirmations, contrastes, console et requêtes en erreur. Smoke test Clients, Team, auth/settings et navigation existante.
- [ ] Une seule revue indépendante globale sur `df15886..HEAD` et éventuelles modifications non commitées, pendant la préparation locale du bilan QA. Corriger les findings importants, revérifier uniquement les zones concernées; aucune contre-revue systématique.
- [ ] Vérifier `git diff --check`, `git status --short --branch`, `git log --oneline df15886..HEAD`, `git rev-parse HEAD`; rapport final : fonctionnalités, tests, QA, limites/findings, SHA final et état Git. Aucun push/merge/déploiement.

Livrable : Phase 3 vérifiée et revue, prête à validation utilisateur.
