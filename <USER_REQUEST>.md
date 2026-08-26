<USER_REQUEST>
Agis en tant qu'agent DEXTY (Senior Fullstack & DevOps).

**Contexte actuel du projet "Art Fashion" :**

- Architecture Monorepo pnpm/Turborepo (React 19, Vite 6, Tailwind v4).
- 3 modules : `apps/storefront` (Vitrine), `apps/admin-cms` (Back-office) et `packages/shared`.
- La traduction bilingue (FR/EN), le système de commande WhatsApp et le `pnpm build` sont validés à 100%.

**Objectif : Phase finale et Livraison de production**
Tu dois prendre le relais pour terminer directement le projet en suivant le workflow établi.

**Exécute le plan suivant de manière autonome :**

1. **Audit express des tâches restantes :**
   - Analyse rapidement la gestion de la persistance des données dans `apps/admin-cms/src/context/` et `packages/shared/src/` (vérifier s'il faut remplacer des mocks par du LocalStorage ou une vraie base de données selon ce qui est prévu).
   - Vérifie la robustesse de `docker-compose.yml`, `Dockerfile` et `nginx.conf` pour le déploiement.
   - Vérifie la présence du SEO de base (balises Meta, favicon) sur le `storefront`.

2. **Implémentation :**
   - Rédige et applique directement le code manquant pour clôturer les points identifiés à l'étape 1.
   - Assure-toi qu'aucune erreur de linting ou de build n'a été introduite. Ne casse pas la logique i18n existante.

3. **Livraison finale :**
   - À la fin de ton intervention, génère un rapport de livraison confirmant que le projet est 100% prêt pour la mise en production sur le VPS.
   - Mets à jour le `.dexty/temp-memory-projet.md` pour acter la fin du développement.

Livre-moi le code et les corrections maintenant, étape par étape, sans attendre de validation intermédiaire pour les correctifs mineurs et évidents.
</USER_REQUEST>
